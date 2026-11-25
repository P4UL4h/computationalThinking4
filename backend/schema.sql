-- The complete database schema of this state of the course.
-- Running it RESETS the database: every board and object is deleted.
-- Run it in the Supabase SQL Editor, or ask Claude to run it through the Supabase MCP.

drop table if exists board_members;
drop table if exists profiles;
drop table if exists objects;
drop table if exists boards;

create table boards (
  id         text primary key,
  name       text not null,
  created_at timestamptz not null default now()
);

-- One table for every variant: columns a variant does not have stay empty (null).
create table objects (
  id         text primary key,
  board_id   text not null references boards(id) on delete cascade,
  type       text not null,
  x          integer not null,
  y          integer not null,
  width      integer not null,
  height     integer not null,
  text       text,
  font_size  integer,
  bold       boolean,
  color      text,
  created_at timestamptz not null default now()
);

-- Only the backend (with the secret key) may read and write. Without policies,
-- the Data API gives nothing to anyone holding just the publishable key.
alter table boards enable row level security;
alter table objects enable row level security;

-- Everyone who has logged in once, so they can be found by their email.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  name       text not null,
  avatar_url text
);

-- Who may see a board. Whoever creates a board is its first member.
create table board_members (
  board_id text not null references boards(id) on delete cascade,
  user_id  uuid not null references profiles(id) on delete cascade,
  primary key (board_id, user_id)
);

alter table profiles enable row level security;
alter table board_members enable row level security;

-- New tables are no longer readable through the Data API by default, not even with the secret key.
grant select, insert, update, delete on boards, objects, profiles, board_members to service_role;

insert into boards (id, name) values (gen_random_uuid()::text, 'Mein erstes Board');
