-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for user progress
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  course_id text not null,
  module_id text not null,
  completed boolean default false,
  score integer,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, module_id)
);

alter table user_progress enable row level security;

create policy "Users can view own progress." on user_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress." on user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress." on user_progress
  for update using (auth.uid() = user_id);

-- Create a table for user artifacts (generated content)
create table user_artifacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'campaign', 'image', 'seo_analysis', 'brand_voice'
  title text,
  content jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table user_artifacts enable row level security;

create policy "Users can view own artifacts." on user_artifacts
  for select using (auth.uid() = user_id);

create policy "Users can insert own artifacts." on user_artifacts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own artifacts." on user_artifacts
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
