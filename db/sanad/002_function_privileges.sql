-- Per-schema defaults cannot remove PostgreSQL's global PUBLIC EXECUTE default.
begin;
do $$ begin
  if current_database() !~ '^sanad_' then raise exception 'UNAVAILABLE'; end if;
end $$;
set role sanad_owner;
alter default privileges revoke execute on functions from public;
revoke execute on all functions in schema sanad from public;
reset role;
commit;
