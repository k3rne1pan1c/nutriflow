-- NutriFlow initial schema

-- Catalog tables (seeded, read-only for authenticated users)
create table public.ingredients (
	id text primary key,
	name text not null,
	category text not null,
	unit text not null,
	emoji text
);

create table public.recipes (
	id text primary key,
	data jsonb not null
);

-- User profile (1:1 with auth.users)
create table public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	profile_data jsonb not null default '{}'::jsonb,
	onboarded boolean not null default false,
	hydration_glasses int not null default 5,
	notifications jsonb not null default '{"mealReminders":true,"shoppingReminders":true,"hydration":false}'::jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table public.household_members (
	id text not null,
	user_id uuid not null references public.profiles (id) on delete cascade,
	data jsonb not null,
	primary key (user_id, id)
);

create table public.pantry_items (
	user_id uuid not null references public.profiles (id) on delete cascade,
	ingredient_id text not null references public.ingredients (id),
	amount numeric not null default 0,
	unit text not null,
	primary key (user_id, ingredient_id)
);

create table public.meal_plans (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles (id) on delete cascade,
	week_start date not null,
	days jsonb not null,
	checked_shopping jsonb not null default '[]'::jsonb,
	is_active boolean not null default true,
	created_at timestamptz not null default now()
);

create index meal_plans_user_active_idx on public.meal_plans (user_id, is_active);

create table public.user_ingredient_prices (
	user_id uuid not null references public.profiles (id) on delete cascade,
	ingredient_id text not null references public.ingredients (id),
	price numeric not null,
	per_unit text not null,
	primary key (user_id, ingredient_id)
);

create table public.favorites (
	user_id uuid not null references public.profiles (id) on delete cascade,
	recipe_id text not null references public.recipes (id),
	primary key (user_id, recipe_id)
);

create table public.plan_generations (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles (id) on delete cascade,
	created_at timestamptz not null default now()
);

create index plan_generations_user_day_idx on public.plan_generations (user_id, created_at);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.profiles (id) values (new.id);
	return new;
end;
$$;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();

-- RLS
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.profiles enable row level security;
alter table public.household_members enable row level security;
alter table public.pantry_items enable row level security;
alter table public.meal_plans enable row level security;
alter table public.user_ingredient_prices enable row level security;
alter table public.favorites enable row level security;
alter table public.plan_generations enable row level security;

create policy "ingredients_select" on public.ingredients for select to authenticated using (true);
create policy "recipes_select" on public.recipes for select to authenticated using (true);

create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

create policy "household_select" on public.household_members for select using (auth.uid() = user_id);
create policy "household_insert" on public.household_members for insert with check (auth.uid() = user_id);
create policy "household_update" on public.household_members for update using (auth.uid() = user_id);
create policy "household_delete" on public.household_members for delete using (auth.uid() = user_id);

create policy "pantry_select" on public.pantry_items for select using (auth.uid() = user_id);
create policy "pantry_insert" on public.pantry_items for insert with check (auth.uid() = user_id);
create policy "pantry_update" on public.pantry_items for update using (auth.uid() = user_id);
create policy "pantry_delete" on public.pantry_items for delete using (auth.uid() = user_id);

create policy "meal_plans_select" on public.meal_plans for select using (auth.uid() = user_id);
create policy "meal_plans_insert" on public.meal_plans for insert with check (auth.uid() = user_id);
create policy "meal_plans_update" on public.meal_plans for update using (auth.uid() = user_id);
create policy "meal_plans_delete" on public.meal_plans for delete using (auth.uid() = user_id);

create policy "prices_select" on public.user_ingredient_prices for select using (auth.uid() = user_id);
create policy "prices_insert" on public.user_ingredient_prices for insert with check (auth.uid() = user_id);
create policy "prices_update" on public.user_ingredient_prices for update using (auth.uid() = user_id);
create policy "prices_delete" on public.user_ingredient_prices for delete using (auth.uid() = user_id);

create policy "favorites_select" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on public.favorites for delete using (auth.uid() = user_id);

create policy "plan_generations_select" on public.plan_generations for select using (auth.uid() = user_id);
create policy "plan_generations_insert" on public.plan_generations for insert with check (auth.uid() = user_id);
