import { redirect } from '@sveltejs/kit';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, parent }) => {
	if (!isSupabaseConfigured()) return {};

	if (!locals.session) {
		redirect(303, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	const { userData } = await parent();
	const onboarded = userData?.onboarded ?? false;
	const isEdit = url.searchParams.get('edit') === '1';

	if (!onboarded && url.pathname !== '/onboarding') {
		redirect(303, '/onboarding');
	}

	if (onboarded && url.pathname === '/onboarding' && !isEdit) {
		redirect(303, '/dashboard');
	}

	return { onboarded };
};
