-- func to check notes limit per user
create or replace function public.check_notes_limit()
return trigger
language plpgsql
as $$ 
declare
    current_month text;
    monthly_count int;
    user_limit int;
begin
    -- Get current year and month
    current_month := to_char(now(), 'YYYY-MM');

    -- Get user's note limit from profiles table
    select note_limit into user_limit from public.profiles where user_id = new.user_id;

    -- Get current month's note count from usage_tracking table
    select notes_created into monthly_count 
    from public.usage_tracking 
    where user_id = new.user_id and year_month = current_month;

    -- Check if limit is exceeded
    if monthly_count >= user_limit then
        raise exception 'Note limit of % reached for the month', user_limit;
    end if;

    return new;
end;
$$;

create trigger enforce_notes_limit
    before insert on public.notes
    for each row execute function check_notes_limit();