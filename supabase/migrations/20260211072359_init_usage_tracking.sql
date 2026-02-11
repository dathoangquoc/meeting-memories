create table public.usage_tracking (
    user_id uuid references profiles(user_id) on delete cascade,
    year_month text,
    usage_count int default 0,
    primary key (user_id, year_month)
);

-- Enable RLS
alter table usage_tracking enable row level security;

-- func to increment usage count when a note is created
create or replace function public.increment_usage_count()
return trigger
language plpgsql
as $$
begin
    insert into usage_tracking (user_id, year_month, usage_count)
    values (new.user_id, to_char(now(), 'YYYY-MM'), 1);
    on conflict (user_id, year_month)
    do update set usage_count = usage_tracking.usage_count + 1;
    return new;
end;
$$;

-- trigger to call increment_usage_count on note creation
create trigger on_note_created
    after insert on public.notes
    for each row execute function increment_usage_count();

-- Security policy: Users can read their own usage tracking
create policy "Users can read own usage tracking"
on public.usage_tracking for select
using ( (select auth.uid()) = user_id);