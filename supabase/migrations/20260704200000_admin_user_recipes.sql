-- Track which user owns / was assigned each generated recipe

create table public.user_recipes (
	user_id uuid not null references public.profiles (id) on delete cascade,
	recipe_id text not null references public.recipes (id) on delete cascade,
	source text not null check (source in ('ai', 'admin')),
	created_at timestamptz not null default now(),
	primary key (user_id, recipe_id)
);

create index user_recipes_user_idx on public.user_recipes (user_id, created_at desc);
create index user_recipes_recipe_idx on public.user_recipes (recipe_id);

alter table public.user_recipes enable row level security;

create policy "user_recipes_select" on public.user_recipes
	for select to authenticated
	using (auth.uid() = user_id);

create policy "user_recipes_insert_ai" on public.user_recipes
	for insert to authenticated
	with check (auth.uid() = user_id and source = 'ai');

grant select, insert on public.user_recipes to authenticated, service_role;
grant delete on public.user_recipes to service_role;
