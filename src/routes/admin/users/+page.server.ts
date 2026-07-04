import { loadAdminUsers } from '$lib/server/adminData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await loadAdminUsers();
	return { users };
};
