-- create_board_people.sql
create table board_people (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  person_id uuid references people(id),
  role_id uuid references roles(id)
);
