create table public.usage_tracking (
    user_id uuid references profiles(user_id) on delete cascade,
    year_month text,
    notes_created int default 0,
    primary key (user_id, year_month)
);

-- Enable RLS
alter table usage_tracking enable row level security;

-- func to increment notes_created when a note is created
create or replace function public.increment_notes_created()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into usage_tracking (user_id, year_month, notes_created)
    values (new.user_id, to_char(now(), 'YYYY-MM'), 1)
    on conflict (user_id, year_month)
    do update set notes_created = usage_tracking.notes_created + 1;
    return new;
end;
$$;

-- trigger to call increment_notes_created on note creation
create trigger on_note_created
    after insert on public.notes
    for each row execute function increment_notes_created();

-- Security policy: Users can read their own usage tracking
create policy "Users can read own usage tracking"
on public.usage_tracking for select
using ( (select auth.uid()) = user_id);