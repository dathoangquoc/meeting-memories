-- func to update note limit when subscription tier changes
create or replace function public.update_note_limit_on_tier_change()
return trigger
language plpgsql
as $$
begin
    update public.profiles
    set note_limit = 
        case new.tier
            when 'free' then 10
            when 'premium' then 100
            else 100 -- default to free tier limit
        end
    where user_id = new.user_id;
    
    return new;
end;

-- trigger to call on tier change
create trigger on_account_tier_change
    before update of tier on public.profiles
    for each row execute function update_note_limit_on_tier_change();