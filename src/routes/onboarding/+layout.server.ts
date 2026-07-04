import { redirect } from '@sveltejs/kit';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, parent }) => {
	if (!isSupabaseConfigured()) return {};

	if (!locals.session) {
		redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	const { userData } = await parent();
	const isEdit = url.searchParams.get('edit') === '1';
	if (userData?.onboarded && !isEdit) {
		redirect(303, '/dashboard');
	}

	return { editMode: isEdit };
};
