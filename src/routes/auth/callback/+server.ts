import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase/server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const redirectTo = url.searchParams.get('redirect') || '/dashboard';

	if (code) {
		const supabase = createSupabaseServerClient(cookies);
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, redirectTo);
		}
	}

	redirect(303, '/auth/login?error=auth');
};
