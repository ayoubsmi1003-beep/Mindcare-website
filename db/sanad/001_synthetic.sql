-- A dedicated synthetic database only. Run once with an isolated administrator.
begin;
do $$ begin
  if current_database() !~ '^sanad_' then raise exception 'UNAVAILABLE'; end if;
  if not exists(select 1 from pg_roles where rolname='sanad_owner') then create role sanad_owner nologin nosuperuser nobypassrls; end if;
  if not exists(select 1 from pg_roles where rolname='sanad_runtime') then create role sanad_runtime nologin nosuperuser nobypassrls noinherit; end if;
end $$;
create schema sanad authorization sanad_owner;
revoke all on schema sanad from public;
grant usage on schema sanad to sanad_runtime;
set role sanad_owner;
alter default privileges in schema sanad revoke execute on functions from public;

create table sanad.environment (
  id boolean primary key check(id), instance_id uuid not null unique,
  mode text not null check(mode='synthetic'), installed_at timestamptz not null default now()
);
create function sanad.immutable_marker() returns trigger language plpgsql set search_path=pg_catalog,sanad as $$
begin raise exception 'FORBIDDEN'; end $$;
create trigger immutable_marker before update or delete on sanad.environment for each row execute function sanad.immutable_marker();

create table sanad.profiles (
  id uuid primary key default gen_random_uuid(), phone text not null unique check(phone ~ '^\+447700900[0-9]{3}$'),
  display_name text not null check(length(display_name) between 1 and 80), locale text not null check(locale in ('fr','ar','en')),
  password_hash text not null check(password_hash ~ '^scrypt\$16384\$[a-f0-9]{32}\$[a-f0-9]{128}$'),
  credential_version integer not null default 1, enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create table sanad.sessions (
  token_hash text primary key check(token_hash ~ '^[a-f0-9]{64}$'), patient_id uuid not null references sanad.profiles,
  credential_version integer not null, expires_at timestamptz not null, revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index sessions_patient on sanad.sessions(patient_id);
create table sanad.auth_limits (key text primary key, started_at timestamptz not null, attempts integer not null);
create table sanad.records (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references sanad.profiles,
  kind text not null check(kind in ('checkin','adherence','adverse','journal','goal','activity','weeklyReview','preparation','message','request','favorite','exerciseProgress','preferences','memory','conversation','treatment','appointment','document','prescribedGoal')),
  body jsonb not null check(jsonb_typeof(body)='object' and octet_length(body::text)<=65536),
  version integer not null check(version>0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index records_patient on sanad.records(patient_id,updated_at);
create table sanad.revisions (
  record_id uuid not null references sanad.records, version integer not null,
  patient_id uuid not null references sanad.profiles, body jsonb not null,
  created_at timestamptz not null default now(), primary key(record_id,version)
);
create table sanad.shares (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references sanad.profiles,
  record_id uuid not null, record_version integer not null, shared_at timestamptz not null default now(), revoked_at timestamptz,
  foreign key(record_id,record_version) references sanad.revisions(record_id,version), unique(record_id,record_version)
);
create table sanad.idempotency (
  patient_id uuid not null references sanad.profiles, key text not null check(length(key) between 8 and 128),
  request jsonb not null, result jsonb not null, created_at timestamptz not null default now(), primary key(patient_id,key)
);
create table sanad.audit (
  id bigint generated always as identity primary key, patient_id uuid references sanad.profiles,
  action text not null, object_id uuid, version integer, occurred_at timestamptz not null default now()
);
-- Only verified SQL gates set this identity; runtime has no direct table privileges.
do $$ declare t text; begin
  foreach t in array array['records','revisions','shares','idempotency'] loop
    execute format('alter table sanad.%I enable row level security',t);
    execute format('alter table sanad.%I force row level security',t);
    execute format('create policy patient_scope on sanad.%I using (patient_id=nullif(current_setting(''sanad.patient_id'',true),'''')::uuid) with check (patient_id=nullif(current_setting(''sanad.patient_id'',true),'''')::uuid)',t);
  end loop;
end $$;

create function sanad.assert_environment(p_instance uuid) returns void language plpgsql security definer set search_path=pg_catalog,sanad as $$
begin
  if current_database() !~ '^sanad_' or not exists(select 1 from sanad.environment where id and instance_id=p_instance and mode='synthetic') then raise exception 'UNAVAILABLE'; end if;
end $$;
create function sanad.identity(p_instance uuid,p_token text) returns uuid language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  perform sanad.assert_environment(p_instance);
  select s.patient_id into p from sanad.sessions s join sanad.profiles a on a.id=s.patient_id
    where s.token_hash=p_token and s.revoked_at is null and s.expires_at>now() and a.enabled and a.credential_version=s.credential_version for share of s,a;
  if p is null then raise exception 'UNAUTHENTICATED'; end if;
  perform set_config('sanad.patient_id',p::text,true);
  return p;
end $$;
create function sanad.record_json(r sanad.records) returns jsonb language sql immutable set search_path=pg_catalog,sanad as $$
  select jsonb_build_object('id',r.id,'kind',r.kind,'body',r.body,'version',r.version,'createdAt',r.created_at,'updatedAt',r.updated_at)
$$;
create function sanad.share_json(s sanad.shares) returns jsonb language sql immutable set search_path=pg_catalog,sanad as $$
  select jsonb_build_object('id',s.id,'recordId',s.record_id,'recordVersion',s.record_version,'sharedAt',s.shared_at,'revokedAt',s.revoked_at)
$$;
create function sanad.auth_candidate(p_instance uuid,p_phone text,p_ip text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare k text; n integer; lim integer; a sanad.profiles;
begin
  perform sanad.assert_environment(p_instance);
  foreach k in array array['phone:'||encode(sha256(convert_to(p_phone,'UTF8')),'hex'),'ip:'||p_ip] loop
    lim:=case when k like 'phone:%' then 10 else 60 end;
    insert into sanad.auth_limits(key,started_at,attempts) values(k,now(),1)
    on conflict(key) do update set attempts=case when sanad.auth_limits.started_at<now()-interval '15 minutes' then 1 else sanad.auth_limits.attempts+1 end,
      started_at=case when sanad.auth_limits.started_at<now()-interval '15 minutes' then now() else sanad.auth_limits.started_at end returning attempts into n;
    if n>lim then return jsonb_build_object('limited',true); end if;
  end loop;
  select * into a from sanad.profiles where phone=p_phone and enabled;
  if not found then return null; end if;
  return jsonb_build_object('id',a.id,'hash',a.password_hash,'revision',a.credential_version);
end $$;
create function sanad.auth_session(p_instance uuid,p_patient uuid,p_revision integer,p_token text) returns timestamptz language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare deadline timestamptz:=now()+interval '12 hours';
begin
  perform sanad.assert_environment(p_instance);
  perform 1 from sanad.profiles where id=p_patient and credential_version=p_revision and enabled for share;
  if not found then raise exception 'UNAUTHENTICATED'; end if;
  insert into sanad.sessions(token_hash,patient_id,credential_version,expires_at) values(p_token,p_patient,p_revision,deadline);
  insert into sanad.audit(patient_id,action) values(p_patient,'session_created');
  return deadline;
end $$;
create function sanad.resolve_session(p_instance uuid,p_token text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  p:=sanad.identity(p_instance,p_token);
  return (select jsonb_build_object('id',id,'displayName',display_name,'locale',locale) from sanad.profiles where id=p);
end $$;
create function sanad.sign_out(p_instance uuid,p_token text) returns void language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  perform sanad.assert_environment(p_instance);
  update sanad.sessions set revoked_at=coalesce(revoked_at,now()) where token_hash=p_token returning patient_id into p;
  if p is not null then insert into sanad.audit(patient_id,action) values(p,'session_revoked'); end if;
end $$;
create function sanad.password_candidate(p_instance uuid,p_token text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  p:=sanad.identity(p_instance,p_token);
  return sanad.auth_candidate(p_instance,(select phone from sanad.profiles where id=p),'password:'||p::text);
end $$;
create function sanad.change_password(p_instance uuid,p_token text,p_revision integer,p_hash text) returns void language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  p:=sanad.identity(p_instance,p_token);
  update sanad.profiles set password_hash=p_hash,credential_version=credential_version+1 where id=p and credential_version=p_revision;
  if not found then raise exception 'CONFLICT'; end if;
  update sanad.sessions set revoked_at=coalesce(revoked_at,now()) where patient_id=p;
  insert into sanad.audit(patient_id,action) values(p,'password_changed');
end $$;
create function sanad.get_state(p_instance uuid,p_token text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  p:=sanad.identity(p_instance,p_token);
  return jsonb_build_object('profile',(select jsonb_build_object('id',id,'displayName',display_name,'locale',locale) from sanad.profiles where id=p),
    'records',coalesce((select jsonb_agg(sanad.record_json(r) order by r.updated_at desc,r.id) from sanad.records r
      where r.kind not in ('treatment','appointment','document','prescribedGoal') or r.body->'shared'='true'::jsonb),'[]'::jsonb),
    'shares',coalesce((select jsonb_agg(sanad.share_json(s) order by s.shared_at,s.id) from sanad.shares s),'[]'::jsonb));
end $$;
create function sanad.get_receipt(p_instance uuid,p_token text,p_key text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
begin
  perform sanad.identity(p_instance,p_token);
  return (select result from sanad.idempotency where key=p_key and request->>'action'='save');
end $$;
create function sanad.save_record(p_instance uuid,p_token text,p_kind text,p_id uuid,p_expected integer,p_key text,p_body jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid; r sanad.records; treatment sanad.records; req jsonb; cached sanad.idempotency; result jsonb; declared_at timestamptz;
begin
  p:=sanad.identity(p_instance,p_token);
  if p_kind not in ('checkin','adherence','adverse','journal','goal','activity','weeklyReview','preparation','message','request','favorite','exerciseProgress','preferences','memory','conversation') then raise exception 'FORBIDDEN'; end if;
  if p_key is null or length(p_key) not between 8 and 128 or p_body is null or jsonb_typeof(p_body)<>'object' or octet_length(p_body::text)>65536 or (p_id is null and p_expected is not null) or (p_id is not null and (p_expected is null or p_expected<1)) then raise exception 'INVALID_INPUT'; end if;
  req:=jsonb_build_object('action','save','kind',p_kind,'id',p_id,'version',p_expected,'body',p_body);
  perform pg_advisory_xact_lock(hashtextextended(p::text||':'||p_key,0));
  select * into cached from sanad.idempotency where patient_id=p and key=p_key;
  if found then
    if cached.request<>req then raise exception 'CONFLICT'; end if;
    return cached.result;
  end if;
  if p_id is not null then
    select * into r from sanad.records where id=p_id for update;
    if not found then raise exception 'FORBIDDEN'; end if;
    if r.version<>p_expected or r.kind<>p_kind then raise exception 'CONFLICT'; end if;
  end if;
  if p_kind='adherence' then
    if jsonb_typeof(p_body->'treatmentVersion') is distinct from 'number' or p_body->>'treatmentVersion' !~ '^[1-9][0-9]{0,9}$' then raise exception 'INVALID_INPUT'; end if;
    if (p_body->>'treatmentVersion')::numeric>2147483647 then raise exception 'INVALID_INPUT'; end if;
    if p_body->>'status' is null or p_body->>'status' not in ('taken','forgotten','not_taken') then raise exception 'INVALID_INPUT'; end if;
  end if;
  if p_kind='adherence' and p_id is not null then
    -- A correction changes the declaration, never its historical source or scheduled slot.
    if (p_body-array['status','reason'])<>(r.body-array['status','reason']) then raise exception 'CONFLICT'; end if;
  elsif p_kind in ('adherence','adverse') and p_body ? 'treatmentId' then
    select * into treatment from sanad.records where id=(p_body->>'treatmentId')::uuid and kind='treatment' for share;
    if not found then raise exception 'FORBIDDEN'; end if;
    if p_kind='adherence' then
      if treatment.version<>(p_body->>'treatmentVersion')::integer or treatment.body->>'status' is distinct from 'active' or treatment.body->'shared' is distinct from 'true'::jsonb then raise exception 'CONFLICT'; end if;
      declared_at:=coalesce((p_body->>'scheduledAt')::timestamptz,now());
      if treatment.body->>'validFrom' is null or (treatment.body->>'validFrom')::timestamptz>declared_at
        or (treatment.body->>'validUntil')::timestamptz<=declared_at then raise exception 'CONFLICT'; end if;
      p_body:=p_body||jsonb_build_object('treatmentVersion',treatment.version);
    end if;
  elsif p_kind='adherence' then raise exception 'INVALID_INPUT';
  end if;
  if p_id is null then
    insert into sanad.records(patient_id,kind,body,version) values(p,p_kind,p_body,1) returning * into r;
  else
    update sanad.records set body=p_body,version=version+1,updated_at=now() where id=p_id returning * into r;
  end if;
  insert into sanad.revisions(record_id,version,patient_id,body) values(r.id,r.version,p,r.body);
  if p_kind='preferences' then
    if (p_body ? 'locale' and (jsonb_typeof(p_body->'locale')<>'string' or p_body->>'locale' not in ('fr','ar','en')))
      or (p_body ? 'displayName' and (jsonb_typeof(p_body->'displayName')<>'string' or length(btrim(p_body->>'displayName')) not between 1 and 80)) then raise exception 'INVALID_INPUT'; end if;
    update sanad.profiles set display_name=coalesce(p_body->>'displayName',display_name),locale=coalesce(p_body->>'locale',locale) where id=p;
  end if;
  insert into sanad.audit(patient_id,action,object_id,version) values(p,'record_saved',r.id,r.version);
  result:=sanad.record_json(r);
  insert into sanad.idempotency(patient_id,key,request,result) values(p,p_key,req,result);
  return result;
end $$;
create function sanad.set_share(p_instance uuid,p_token text,p_id uuid,p_version integer,p_shared boolean,p_key text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid; r sanad.records; s sanad.shares; req jsonb; cached sanad.idempotency; result jsonb;
begin
  p:=sanad.identity(p_instance,p_token);
  if p_key is null or length(p_key) not between 8 and 128 or p_version is null or p_version<1 or p_shared is null then raise exception 'INVALID_INPUT'; end if;
  req:=jsonb_build_object('action','share','id',p_id,'version',p_version,'shared',p_shared);
  perform pg_advisory_xact_lock(hashtextextended(p::text||':'||p_key,0));
  select * into cached from sanad.idempotency where patient_id=p and key=p_key;
  if found then
    if cached.request<>req then raise exception 'CONFLICT'; end if;
    return (select sanad.share_json(x) from sanad.shares x where x.id=(cached.result->>'id')::uuid);
  end if;
  select * into r from sanad.records where id=p_id for update;
  if not found then raise exception 'FORBIDDEN'; end if;
  perform 1 from sanad.revisions where record_id=p_id and version=p_version;
  if not found then raise exception 'CONFLICT'; end if;
  select * into s from sanad.shares where record_id=p_id and record_version=p_version for update;
  if p_shared then
    if s.revoked_at is not null then raise exception 'CONFLICT'; end if;
    if s.id is null then insert into sanad.shares(patient_id,record_id,record_version) values(p,p_id,p_version) returning * into s; end if;
  else
    if s.id is null then raise exception 'CONFLICT'; end if;
    update sanad.shares set revoked_at=coalesce(revoked_at,now()) where id=s.id returning * into s;
  end if;
  insert into sanad.audit(patient_id,action,object_id,version) values(p,case when p_shared then 'share_granted' else 'share_revoked' end,p_id,p_version);
  result:=sanad.share_json(s);
  insert into sanad.idempotency(patient_id,key,request,result) values(p,p_key,req,result);
  return result;
end $$;

-- Operator gates are deliberately never executable by the website runtime role.
create function sanad.operator_provision(p_instance uuid,p_phone text,p_name text,p_locale text,p_hash text,p_identity_consent text) returns uuid language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  perform sanad.assert_environment(p_instance);
  if p_identity_consent is null or length(p_identity_consent)<16 then raise exception 'INVALID_INPUT'; end if;
  insert into sanad.profiles(phone,display_name,locale,password_hash) values(p_phone,p_name,p_locale,p_hash) returning id into p;
  insert into sanad.audit(patient_id,action) values(p,'synthetic_identity_consent_verified');
  return p;
end $$;
create function sanad.operator_reset(p_instance uuid,p_patient uuid,p_hash text,p_identity_consent text) returns void language plpgsql security definer set search_path=pg_catalog,sanad as $$
begin
  perform sanad.assert_environment(p_instance);
  if p_identity_consent is null or length(p_identity_consent)<16 then raise exception 'INVALID_INPUT'; end if;
  update sanad.profiles set password_hash=p_hash,credential_version=credential_version+1 where id=p_patient and enabled;
  if not found then raise exception 'FORBIDDEN'; end if;
  update sanad.sessions set revoked_at=coalesce(revoked_at,now()) where patient_id=p_patient;
  insert into sanad.audit(patient_id,action) values(p_patient,'synthetic_identity_reverified_password_reset');
end $$;
create function sanad.operator_receive(p_instance uuid,p_patient uuid,p_id uuid,p_kind text,p_version integer,p_body jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare r sanad.records;
begin
  perform sanad.assert_environment(p_instance);
  if p_kind not in ('treatment','appointment','document','prescribedGoal') or p_version<1 then raise exception 'INVALID_INPUT'; end if;
  perform 1 from sanad.profiles where id=p_patient and enabled for share;
  if not found then raise exception 'FORBIDDEN'; end if;
  perform set_config('sanad.patient_id',p_patient::text,true);
  perform pg_advisory_xact_lock(hashtextextended(p_id::text,0));
  select * into r from sanad.records where id=p_id for update;
  if r.id is not null then
    if r.patient_id<>p_patient or r.kind<>p_kind then raise exception 'FORBIDDEN'; end if;
    if r.version>p_version then raise exception 'CONFLICT'; end if;
    if r.version=p_version then
      if r.body<>p_body then raise exception 'CONFLICT'; end if;
      return sanad.record_json(r);
    end if;
    update sanad.records set body=p_body,version=p_version,updated_at=now() where id=p_id returning * into r;
  else
    insert into sanad.records(id,patient_id,kind,body,version) values(p_id,p_patient,p_kind,p_body,p_version) returning * into r;
  end if;
  insert into sanad.revisions(record_id,version,patient_id,body) values(r.id,r.version,p_patient,r.body);
  insert into sanad.audit(patient_id,action,object_id,version) values(p_patient,'synthetic_inbound_accepted',r.id,r.version);
  return sanad.record_json(r);
end $$;

grant execute on function sanad.get_receipt(uuid,text,text),sanad.assert_environment(uuid),sanad.auth_candidate(uuid,text,text),sanad.auth_session(uuid,uuid,integer,text),sanad.resolve_session(uuid,text),sanad.sign_out(uuid,text),sanad.password_candidate(uuid,text),sanad.change_password(uuid,text,integer,text),sanad.get_state(uuid,text),sanad.save_record(uuid,text,text,uuid,integer,text,jsonb),sanad.set_share(uuid,text,uuid,integer,boolean,text) to sanad_runtime;
reset role;
commit;

