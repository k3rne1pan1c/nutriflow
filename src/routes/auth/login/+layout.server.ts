import { redirect } from '@sveltejs/kit';
import { isDevAuth } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { session, devAuth } = await parent();
	if (session) {
		const redirectTo = url.searchParams.get('redirect') || '/dashboard';
		redirect(303, redirectTo);
	}
	return { devAuth: devAuth ?? isDevAuth };
};
