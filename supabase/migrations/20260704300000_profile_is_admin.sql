-- Admin flag on profiles (managed via service role / admin API only)

alter table public.profiles
	add column if not exists is_admin boolean not null default false;

create index if not exists profiles_is_admin_idx on public.profiles (is_admin)
	where is_admin = true;

-- Authenticated users cannot promote themselves; only service role may change is_admin
create or replace function public.protect_is_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	if coalesce(auth.role(), '') = 'authenticated'
		and new.is_admin is distinct from old.is_admin then
		new.is_admin := old.is_admin;
	end if;
	return new;
end;
$$;

drop trigger if exists profiles_protect_is_admin on public.profiles;
create trigger profiles_protect_is_admin
	before update on public.profiles
	for each row
	execute function public.protect_is_admin();

-- Bootstrap: promote your account after signup (replace with your auth.users id):
-- update public.profiles set is_admin = true where id = 'YOUR-USER-UUID';
