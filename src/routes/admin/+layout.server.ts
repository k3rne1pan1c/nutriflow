import { redirect, error } from '@sveltejs/kit';
import { isSupabaseConfigured } from '$lib/supabase/client';
import { requireAdmin } from '$lib/server/admin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!isSupabaseConfigured()) {
		error(503, 'Supabase not configured');
	}

	if (!locals.session) {
		redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	await requireAdmin(locals.supabase, locals.user);

	return { adminEmail: locals.user?.email ?? '' };
};
