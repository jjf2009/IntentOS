-- Per-user thread isolation (Supabase)

create extension if not exists "pgcrypto";

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  role text not null,
  content jsonb not null,
  component_state jsonb not null default '{}'::jsonb,
  additional_context jsonb,
  component jsonb,
  tool_call_request jsonb,
  tool_calls jsonb,
  tool_call_id text,
  parent_message_id uuid,
  reasoning jsonb,
  reasoning_duration_ms integer,
  error text,
  is_cancelled boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.messages drop constraint if exists messages_role_check;
alter table public.messages
  add constraint messages_role_check
  check (role in ('user', 'assistant', 'system', 'tool'));

create index if not exists messages_thread_id_created_at_idx
  on public.messages (thread_id, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at
before update on public.threads
for each row
execute function public.set_updated_at();

alter table public.threads enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Users can read their own threads" on public.threads;
create policy "Users can read their own threads"
on public.threads for select
using (user_id = auth.uid());

drop policy if exists "Users can create their own threads" on public.threads;
create policy "Users can create their own threads"
on public.threads for insert
with check (user_id = auth.uid());

drop policy if exists "Users can update their own threads" on public.threads;
create policy "Users can update their own threads"
on public.threads for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can read messages from their threads" on public.messages;
create policy "Users can read messages from their threads"
on public.messages for select
using (
  exists (
    select 1 from public.threads
    where public.threads.id = public.messages.thread_id
    and public.threads.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert messages into their threads" on public.messages;
create policy "Users can insert messages into their threads"
on public.messages for insert
with check (
  exists (
    select 1 from public.threads
    where public.threads.id = public.messages.thread_id
    and public.threads.user_id = auth.uid()
  )
);

drop policy if exists "Users can update messages in their threads" on public.messages;
create policy "Users can update messages in their threads"
on public.messages for update
using (
  exists (
    select 1 from public.threads
    where public.threads.id = public.messages.thread_id
    and public.threads.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.threads
    where public.threads.id = public.messages.thread_id
    and public.threads.user_id = auth.uid()
  )
);

-- One-time legacy cleanup
delete from public.threads where user_id is null;

delete from public.messages
where thread_id not in (select id from public.threads);
