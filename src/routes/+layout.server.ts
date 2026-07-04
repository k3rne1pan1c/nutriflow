import { redirect } from '@sveltejs/kit';
import { isSupabaseConfigured } from '$lib/supabase/client';
import { isDevAuth } from '$lib/server/auth';
import { getUserIsAdmin } from '$lib/server/admin';
import { loadCatalog, loadUserData } from '$lib/supabase/userData';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!isSupabaseConfigured()) {
		if (url.pathname !== '/setup') {
			redirect(303, '/setup');
		}
		return { session: null, user: null, supabaseConfigured: false, devAuth: false, isAdmin: false };
	}

	const base = {
		session: locals.session,
		user: locals.user,
		supabaseConfigured: true as const,
		devAuth: isDevAuth,
		isAdmin:
			locals.session && locals.supabase
				? await getUserIsAdmin(locals.supabase, locals.session.user.id)
				: false,
		catalog: null as Awaited<ReturnType<typeof loadCatalog>> | null,
		userData: null as Awaited<ReturnType<typeof loadUserData>> | null
	};

	if (!locals.session || !locals.supabase) {
		return base;
	}

	const [catalog, userData] = await Promise.all([
		loadCatalog(locals.supabase),
		loadUserData(locals.supabase, locals.session.user.id)
	]);

	return { ...base, catalog, userData };
};
