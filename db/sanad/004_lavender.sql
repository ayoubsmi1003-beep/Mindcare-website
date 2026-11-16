-- Forward-only lavender upgrade. The operator runner supplies one transaction and checksum ledger.
do $$ begin
  if current_database() !~ '^sanad_' then raise exception 'UNAVAILABLE'; end if;
end $$;
set local role sanad_owner;
alter table sanad.records drop constraint records_kind_check;
alter table sanad.records add constraint records_kind_check check(kind in ('checkin','adherence','adverse','journal','goal','activity','weeklyReview','preparation','message','request','favorite','exerciseProgress','preferences','memory','conversation','treatment','appointment','document','prescribedGoal','clinicMessage','thoughtRecord','consent'));

-- Validation also runs for direct SQL callers; HTTP validation is not an authorization boundary.
create function sanad.validate_lavender_body(k text,b jsonb) returns void language plpgsql set search_path=pg_catalog,sanad as $$
declare allowed text[]; required text[]; field text; v jsonb; item jsonb; n numeric;
begin
  case k
  when 'checkin' then allowed:=array['date','mood','anxiety','sleepHours','energy','effects','emotion','intensity','stress','sleepQuality','contextTags','note']; required:=array['date'];
  when 'journal' then allowed:=array['format','status','situation','emotion','need','helped','text']; required:=case when b->>'format'='free' then array['format','status','text'] else array['situation','emotion','need','helped'] end;
  when 'thoughtRecord' then allowed:=array['templateVersion','status','situation','thought','emotion','response','intensity']; required:=array['templateVersion','status','situation','thought','emotion','response'];
  when 'weeklyReview' then allowed:=array['week','helped','nextStep','difficult','status','templateVersion']; required:=array['week','helped','nextStep'];
  when 'preparation' then allowed:=array['questions','summary','appointmentId','appointmentVersion','selectedSources']; required:=array['questions'];
  when 'preferences' then allowed:=array['displayName','locale','notifications','quietStart','quietEnd','memoryEnabled','closeScreenSafeText','onboardingVersion','reminderDays','readNoticeKeys','motion','textSize']; required:=array[]::text[];
  when 'consent' then allowed:=array['purpose','noticeVersion','accepted']; required:=allowed;
  else return;
  end case;
  if jsonb_typeof(b) is distinct from 'object' or not b ?& required or exists(select 1 from jsonb_object_keys(b) x where not x=any(allowed)) then raise exception 'INVALID_INPUT'; end if;
  for field,v in select * from jsonb_each(b) loop
    if field=any(array['sleepHours','intensity','templateVersion','noticeVersion','onboardingVersion','appointmentVersion']) then
      if jsonb_typeof(v)<>'number' then raise exception 'INVALID_INPUT'; end if;
      n:=v::text::numeric;
      if field='sleepHours' then
        if n<0 or n>24 then raise exception 'INVALID_INPUT'; end if;
      elsif n<>trunc(n) or n<1 or n>(case when field='intensity' then 5 when field='appointmentVersion' then 2147483647 else 1 end) then raise exception 'INVALID_INPUT';
      end if;
    elsif field=any(array['accepted','notifications','memoryEnabled','closeScreenSafeText']) then
      if jsonb_typeof(v)<>'boolean' or (field='closeScreenSafeText' and v<>'true'::jsonb) then raise exception 'INVALID_INPUT'; end if;
    elsif field=any(array['contextTags','reminderDays','readNoticeKeys','selectedSources']) then
      if jsonb_typeof(v)<>'array' then raise exception 'INVALID_INPUT'; end if;
      if jsonb_array_length(v)>(case field when 'contextTags' then 6 when 'reminderDays' then 7 when 'selectedSources' then 20 else 200 end) then raise exception 'INVALID_INPUT'; end if;
      for item in select * from jsonb_array_elements(v) loop
        if field='contextTags' then
          if jsonb_typeof(item)<>'string' or item#>>'{}' not in ('work','family','health','social','rest','other') then raise exception 'INVALID_INPUT'; end if;
        elsif field='reminderDays' then
          if jsonb_typeof(item)<>'number' then raise exception 'INVALID_INPUT'; end if;
          if item::text::numeric not between 1 and 7 or item::text::numeric<>trunc(item::text::numeric) then raise exception 'INVALID_INPUT'; end if;
        elsif field='readNoticeKeys' then
          if jsonb_typeof(item)<>'string' or length(btrim(item#>>'{}')) not between 1 and 200 then raise exception 'INVALID_INPUT'; end if;
        else
          if jsonb_typeof(item)<>'object' or not item ?& array['recordId','version'] or (item-array['recordId','version'])<>'{}'::jsonb or jsonb_typeof(item->'recordId')<>'string' or (item->>'recordId') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' or jsonb_typeof(item->'version')<>'number' then raise exception 'INVALID_INPUT'; end if;
          n:=(item->>'version')::numeric;
          if n<1 or n>2147483647 or n<>trunc(n) then raise exception 'INVALID_INPUT'; end if;
        end if;
      end loop;
    else
      if jsonb_typeof(v)<>'string' or length(v#>>'{}')>6000 then raise exception 'INVALID_INPUT'; end if;
    end if;
  end loop;
  foreach field in array array['date','week'] loop
    if b ? field then
      if b->>field !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'INVALID_INPUT'; end if;
      begin perform (b->>field)::date; exception when others then raise exception 'INVALID_INPUT'; end;
    end if;
  end loop;
  if (b ? 'mood' and b->>'mood' not in ('difficult','mixed','calm'))
    or (b ? 'anxiety' and b->>'anxiety' not in ('low','medium','high'))
    or (b ? 'energy' and b->>'energy' not in ('low','medium','high'))
    or (b ? 'stress' and b->>'stress' not in ('low','medium','high'))
    or (b ? 'sleepQuality' and b->>'sleepQuality' not in ('poor','fair','restful'))
    or (b ? 'locale' and b->>'locale' not in ('fr','ar','en'))
    or (b ? 'motion' and b->>'motion' not in ('system','reduced'))
    or (b ? 'textSize' and b->>'textSize' not in ('standard','large'))
    or (b ? 'displayName' and length(btrim(b->>'displayName')) not between 1 and 80)
    or (b ? 'quietStart' and b->>'quietStart' !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
    or (b ? 'quietEnd' and b->>'quietEnd' !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$') then raise exception 'INVALID_INPUT'; end if;
  if k='checkin' then
    if (b ? 'emotion' and b->>'emotion' not in ('happy','calm','excited','tired','sad','anxious')) or not exists(select 1 from jsonb_each(b-'date') e where e.value not in ('""'::jsonb,'[]'::jsonb) and (jsonb_typeof(e.value)<>'string' or length(btrim(e.value#>>'{}'))>0)) then raise exception 'INVALID_INPUT'; end if;
  elsif k='journal' then
    if (b ? 'format' and b->>'format' not in ('free','guided')) or (b ? 'status' and b->>'status' not in ('draft','saved')) then raise exception 'INVALID_INPUT'; end if;
    if b->>'format'='free' then
      if length(btrim(b->>'text'))=0 then raise exception 'INVALID_INPUT'; end if;
    elsif length(btrim((b->>'situation')||(b->>'emotion')||(b->>'need')||(b->>'helped')))=0 then raise exception 'INVALID_INPUT'; end if;
  elsif k='thoughtRecord' then
    if b->>'status' not in ('draft','completed') or length(btrim((b->>'situation')||(b->>'thought')||(b->>'emotion')||(b->>'response')))=0 or (b->>'status'='completed' and (length(btrim(b->>'situation'))=0 or length(btrim(b->>'thought'))=0)) then raise exception 'INVALID_INPUT'; end if;
  elsif k='weeklyReview' then
    if (b ? 'status' and b->>'status' not in ('draft','completed')) or length(btrim((b->>'helped')||(b->>'nextStep')||coalesce(b->>'difficult','')))=0 then raise exception 'INVALID_INPUT'; end if;
  elsif k='preparation' then
    if length(btrim(b->>'questions'))=0 or (b ? 'appointmentId')<>(b ? 'appointmentVersion') or (b ? 'appointmentId' and b->>'appointmentId' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') then raise exception 'INVALID_INPUT'; end if;
  elsif k='consent' and b->>'purpose' not in ('privacy-notice','in-app-reminders') then raise exception 'INVALID_INPUT';
  end if;
end $$;

create or replace function sanad.save_record(p_instance uuid,p_token text,p_kind text,p_id uuid,p_expected integer,p_key text,p_body jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid; r sanad.records; treatment sanad.records; req jsonb; cached sanad.idempotency; result jsonb; declared_at timestamptz; source jsonb; linked sanad.records;
begin
  p:=sanad.identity(p_instance,p_token);
  if p_kind not in ('checkin','adherence','adverse','journal','goal','activity','weeklyReview','preparation','message','request','favorite','exerciseProgress','preferences','memory','conversation','thoughtRecord','consent') then raise exception 'FORBIDDEN'; end if;
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
  if p_id is not null and p_kind='preparation' then
    p_body:=(r.body-array['questions','summary'])||p_body;
  elsif p_id is not null and p_kind='preferences' then
    p_body:=r.body||p_body;
  end if;
  perform sanad.validate_lavender_body(p_kind,p_body);
  if p_kind='consent' then p_body:=p_body||jsonb_build_object('recordedAt',now()); end if;
  if p_kind='preparation' then
    if p_body ? 'appointmentId' then
      select * into linked from sanad.records where id=(p_body->>'appointmentId')::uuid and kind='appointment' for share;
      if not found then raise exception 'FORBIDDEN'; end if;
      if linked.version<>(p_body->>'appointmentVersion')::integer or linked.body->'shared' is distinct from 'true'::jsonb or linked.body->>'status' is distinct from 'confirmed' then raise exception 'CONFLICT'; end if;
    end if;
    for source in select * from jsonb_array_elements(coalesce(p_body->'selectedSources','[]'::jsonb)) loop
      select * into linked from sanad.records where id=(source->>'recordId')::uuid for share;
      if not found then raise exception 'FORBIDDEN'; end if;
      if linked.version<>(source->>'version')::integer or (linked.kind in ('treatment','appointment','document','prescribedGoal') and linked.body->'shared' is distinct from 'true'::jsonb) then raise exception 'CONFLICT'; end if;
    end loop;
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
create or replace function sanad.set_share(p_instance uuid,p_token text,p_id uuid,p_version integer,p_shared boolean,p_key text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid; r sanad.records; s sanad.shares; req jsonb; cached sanad.idempotency; result jsonb;
begin
  p:=sanad.identity(p_instance,p_token);
  if p_key is null or length(p_key) not between 8 and 128 or p_version is null or p_version<1 or p_shared is null then raise exception 'INVALID_INPUT'; end if;
  req:=jsonb_build_object('action','share','id',p_id,'version',p_version,'shared',p_shared);
  perform pg_advisory_xact_lock(hashtextextended(p::text||':'||p_key,0));
  select * into cached from sanad.idempotency where patient_id=p and key=p_key;
  if found then
    if cached.request<>req then raise exception 'CONFLICT'; end if;
    if p_shared and not exists(select 1 from sanad.records where id=p_id and kind in ('journal','conversation')) then raise exception 'FORBIDDEN'; end if;
    return (select sanad.share_json(x) from sanad.shares x where x.id=(cached.result->>'id')::uuid);
  end if;
  select * into r from sanad.records where id=p_id for update;
  if not found then raise exception 'FORBIDDEN'; end if;
  if p_shared and r.kind not in ('journal','conversation') then raise exception 'FORBIDDEN'; end if;
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
create or replace function sanad.get_state(p_instance uuid,p_token text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid;
begin
  p:=sanad.identity(p_instance,p_token);
  return jsonb_build_object('profile',(select jsonb_build_object('id',id,'displayName',display_name,'locale',locale) from sanad.profiles where id=p),
    'records',coalesce((select jsonb_agg(sanad.record_json(r) order by r.updated_at desc,r.id) from sanad.records r
      where r.kind not in ('treatment','appointment','document','prescribedGoal') or r.body->'shared'='true'::jsonb),'[]'::jsonb),
    'sessionSummary',(select jsonb_build_object('activeCount',count(*),'otherCount',count(*) filter(where s.token_hash<>p_token),'currentExpiresAt',max(s.expires_at) filter(where s.token_hash=p_token)) from sanad.sessions s join sanad.profiles a on a.id=s.patient_id where s.patient_id=p and s.revoked_at is null and s.expires_at>now() and s.credential_version=a.credential_version),
    'shares',coalesce((select jsonb_agg(sanad.share_json(s) order by s.shared_at,s.id) from sanad.shares s),'[]'::jsonb));
end $$;
create function sanad.revoke_other_sessions(p_instance uuid,p_token text,p_key uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare p uuid; cached sanad.idempotency; req jsonb; result jsonb; n integer;
begin
  -- Serialize before identity takes session share locks, avoiding two-session revoke deadlocks.
  perform sanad.assert_environment(p_instance);
  select patient_id into p from sanad.sessions where token_hash=p_token;
  if p is null then raise exception 'UNAUTHENTICATED'; end if;
  perform pg_advisory_xact_lock(hashtextextended('sessions:'||p::text,0));
  p:=sanad.identity(p_instance,p_token);
  if p_key is null then raise exception 'INVALID_INPUT'; end if;
  req:=jsonb_build_object('action','revokeOtherSessions','session',p_token);
  perform pg_advisory_xact_lock(hashtextextended(p::text||':'||p_key::text,0));
  select * into cached from sanad.idempotency where patient_id=p and key=p_key::text;
  if found then
    if cached.request<>req then raise exception 'CONFLICT'; end if;
    return cached.result;
  end if;
  update sanad.sessions set revoked_at=now() where patient_id=p and token_hash<>p_token and revoked_at is null and expires_at>now();
  get diagnostics n=row_count;
  insert into sanad.audit(patient_id,action) values(p,'other_sessions_revoked');
  result:=jsonb_build_object('ok',true,'revokedCount',n);
  insert into sanad.idempotency(patient_id,key,request,result) values(p,p_key::text,req,result);
  return result;
end $$;
revoke all on function sanad.validate_lavender_body(text,jsonb) from public,sanad_runtime;
revoke all on function sanad.revoke_other_sessions(uuid,text,uuid) from public;
grant execute on function sanad.revoke_other_sessions(uuid,text,uuid) to sanad_runtime;
reset role;
