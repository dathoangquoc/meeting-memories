-- Notes table
create table public.notes (
    note_id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles on delete cascade,
    title text not null,
    content text,
    image_url text,
    label text check (label in ('critical', 'urgent', 'normal')),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);