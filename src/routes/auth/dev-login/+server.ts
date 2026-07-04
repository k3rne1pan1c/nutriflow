import { json, error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase/server';
import { devAuthPassword, isDevAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isDevAuth) {
		throw error(404, 'Not found');
	}

	const body = await request.json().catch(() => ({}));
	const email = typeof body.email === 'string' ? body.email.trim() : '';
	if (!email) throw error(400, 'Email required');

	const supabase = createSupabaseServerClient(cookies);

	let { error: signInError } = await supabase.auth.signInWithPassword({
		email,
		password: devAuthPassword
	});

	if (signInError) {
		const { error: signUpError } = await supabase.auth.signUp({
			email,
			password: devAuthPassword
		});
		if (signUpError) throw error(400, signUpError.message);

		const retry = await supabase.auth.signInWithPassword({
			email,
			password: devAuthPassword
		});
		if (retry.error) throw error(400, retry.error.message);
	}

	return json({ ok: true });
};
