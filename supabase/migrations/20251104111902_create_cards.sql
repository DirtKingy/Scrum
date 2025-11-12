-- create_cards.sql
create table cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references columns(id),
  creator_id uuid references people(id),
  assignee_id uuid references people(id),
  title text not null,
  description text,
  labels text[],
  due_date date,
  finished boolean default false,
  position int,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
