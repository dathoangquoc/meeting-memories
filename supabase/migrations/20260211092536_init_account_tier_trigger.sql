-- func to update note limit when subscription plan changes
create or replace function public.update_notes_limit_on_plan_change()
returns trigger
language plpgsql
as $$
begin
    update public.profiles
    set notes_limit = 
        case new.subscription_plan
            when 'free' then 10
            when 'premium' then 100
            else 100 -- default to free plan limit
        end
    where user_id = new.user_id;
    
    return new;
end;
$$;

-- trigger to call on plan change
create trigger on_account_plan_change
    after update of subscription_plan on public.profiles
    for each row execute function update_notes_limit_on_plan_change();