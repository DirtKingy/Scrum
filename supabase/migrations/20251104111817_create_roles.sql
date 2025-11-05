-- create_roles.sql
create table roles (
  id uuid primary key default gen_random_uuid(),
  name text not null
);
