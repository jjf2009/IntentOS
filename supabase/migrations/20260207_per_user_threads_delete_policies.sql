-- Add delete policies for per-user thread isolation (Supabase)

alter table public.threads enable row level security;
alter table public.messages enable row level security;

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
