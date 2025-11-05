-- create_people.sql
create table people (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text
);
