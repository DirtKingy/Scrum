-- create_boards.sql
create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
