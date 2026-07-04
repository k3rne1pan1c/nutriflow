import { loadAdminUserDetail } from '$lib/server/adminData';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const user = await loadAdminUserDetail(params.id);
		return { user };
	} catch {
		error(404, 'User not found');
	}
};
