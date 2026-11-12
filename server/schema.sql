-- Dados da gestante. As tabelas de login ("user", "session", "account", "verification") são do Better Auth.

create table if not exists profiles (
  user_id text primary key references "user"(id) on delete cascade,
  moment text not null default 'gravida',
  method text not null default 'dum',
  dum date,
  ig_weeks int,
  ig_days int,
  ig_set_on date,
  first_pregnancy boolean,
  comm_pref text,
  notify_appointments boolean not null default true,
  notify_medications boolean not null default true,
  notify_diary boolean not null default false,
  show_weight boolean not null default true,
  companion_sharing boolean not null default false,
  maternity_name text,
  maternity_phone text,
  health_consent_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists diary_entries (
  user_id text not null references "user"(id) on delete cascade,
  day date not null,
  feel int not null check (feel between 0 and 4),
  humor text[] not null default '{}',
  sleep text,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  day date not null,
  symptom text not null,
  intensity text not null,
  duration text not null,
  created_at timestamptz not null default now(),
  unique (user_id, day, symptom)
);
create index if not exists symptom_logs_user_day on symptom_logs (user_id, day desc);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  starts_at timestamptz not null,
  title text not null,
  who text not null default '',
  place text not null default '',
  reminded_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_start on appointments (user_id, starts_at);
create index if not exists appointments_reminder on appointments (starts_at) where reminded_at is null;

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists questions_user on questions (user_id, created_at);

create table if not exists medications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  name text not null,
  dose text not null default '',
  time_of_day text not null,
  created_at timestamptz not null default now()
);
create index if not exists medications_user on medications (user_id, time_of_day);

create table if not exists medication_doses (
  medication_id uuid not null references medications(id) on delete cascade,
  day date not null,
  taken_at timestamptz not null default now(),
  primary key (medication_id, day)
);

create table if not exists weights (
  user_id text not null references "user"(id) on delete cascade,
  day date not null,
  kg numeric(5,2) not null check (kg > 20 and kg < 300),
  primary key (user_id, day)
);

create table if not exists checklist_items (
  user_id text not null references "user"(id) on delete cascade,
  list text not null check (list in ('enxoval', 'mala', 'nascimento')),
  label text not null,
  category text,
  custom boolean not null default false,
  done boolean not null default false,
  primary key (user_id, list, label)
);

create table if not exists birth_plan_choices (
  user_id text not null references "user"(id) on delete cascade,
  topic text not null,
  option text not null,
  primary key (user_id, topic, option)
);

create table if not exists saved_articles (
  user_id text not null references "user"(id) on delete cascade,
  article_id text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

-- Conteúdo editável pela área de administração.
create table if not exists content_items (
  collection text not null,
  key text not null,
  position int not null default 0,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (collection, key)
);

create table if not exists admins (
  user_id text primary key references "user"(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists kick_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  kicks int not null check (kicks between 0 and 500)
);
create index if not exists kick_sessions_user on kick_sessions (user_id, started_at desc);

create table if not exists contractions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references "user"(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null
);
create index if not exists contractions_user on contractions (user_id, started_at desc);
