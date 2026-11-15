-- Explicit synthetic operator responses; patients cannot create this record kind.
begin;
do $$ begin
  if current_database() !~ '^sanad_' then raise exception 'UNAVAILABLE'; end if;
end $$;
set role sanad_owner;
alter table sanad.records drop constraint records_kind_check;
alter table sanad.records add constraint records_kind_check check(kind in ('checkin','adherence','adverse','journal','goal','activity','weeklyReview','preparation','message','request','favorite','exerciseProgress','preferences','memory','conversation','treatment','appointment','document','prescribedGoal','clinicMessage'));

create function sanad.sent_message_immutable() returns trigger language plpgsql set search_path=pg_catalog,sanad as $$
begin
  if old.kind='message' and old.body->>'status'='sent' and old.body is distinct from new.body then raise exception 'FORBIDDEN'; end if;
  return new;
end $$;
create trigger sent_message_immutable before update on sanad.records for each row execute function sanad.sent_message_immutable();

create function sanad.operator_reply(p_instance uuid,p_patient uuid,p_message uuid,p_reply uuid,p_text text) returns jsonb language plpgsql security definer set search_path=pg_catalog,sanad as $$
declare r sanad.records;
begin
  perform sanad.assert_environment(p_instance);
  if p_reply is null or p_text is null or length(btrim(p_text)) not between 1 and 6000 then raise exception 'INVALID_INPUT'; end if;
  perform set_config('sanad.patient_id',p_patient::text,true);
  perform 1 from sanad.records where id=p_message and patient_id=p_patient and kind='message' and body->>'status'='sent' for share;
  if not found then raise exception 'FORBIDDEN'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_reply::text,0));
  select * into r from sanad.records where id=p_reply for update;
  if found then
    if r.patient_id<>p_patient or r.kind<>'clinicMessage' or r.body->>'replyTo'<>p_message::text or r.body->>'text'<>p_text then raise exception 'CONFLICT'; end if;
    return sanad.record_json(r);
  end if;
  insert into sanad.records(id,patient_id,kind,body,version) values(p_reply,p_patient,'clinicMessage',jsonb_build_object('replyTo',p_message,'text',p_text,'respondedAt',now(),'simulation',true,'origin','synthetic-clinic'),1) returning * into r;
  insert into sanad.revisions(record_id,version,patient_id,body) values(r.id,r.version,p_patient,r.body);
  insert into sanad.audit(patient_id,action,object_id,version) values(p_patient,'synthetic_clinic_reply',r.id,1);
  return sanad.record_json(r);
end $$;
revoke all on function sanad.operator_reply(uuid,uuid,uuid,uuid,text) from public;
reset role;
commit;
