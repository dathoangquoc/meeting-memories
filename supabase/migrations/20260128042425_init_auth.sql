
create or replace function public.handle_new_user() 
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users can read own profile"
on public.profiles for select
using ( (select auth.uid()) = user_id);

create policy "Users can CRUD own notes"
on public.notes for all
using ( (select auth.uid()) = user_id);

alter table public.profiles enable row level security;
alter table public.notes enable row level security;

CREATE INDEX idx_tasks_user_created 
ON public.notes(user_id, created_at DESC);

-- Function to create usage_tracking row for new users
create or replace function public.handle_new_usage_tracking()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.usage_tracking (user_id, year_month, notes_created)
  values (new.user_id, to_char(now(), 'YYYY-MM'), 0);
  return new;
end;
$$ language plpgsql;

-- Trigger to create usage_tracking row after profile is created
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_usage_tracking();
