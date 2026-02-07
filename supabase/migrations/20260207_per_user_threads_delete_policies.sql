-- Add delete policies for per-user thread isolation (Supabase)

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

drop policy if exists "Users can delete their own threads" on public.threads;
create policy "Users can delete their own threads"
on public.threads for delete
using (user_id = auth.uid());

drop policy if exists "Users can delete messages in their threads" on public.messages;
create policy "Users can delete messages in their threads"
on public.messages for delete
using (
  exists (
    select 1 from public.threads
    where public.threads.id = public.messages.thread_id
    and public.threads.user_id = auth.uid()
  )
);

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
