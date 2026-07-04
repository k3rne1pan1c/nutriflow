import { loadAdminRecipes, loadAdminUsers } from '$lib/server/adminData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [recipes, users] = await Promise.all([loadAdminRecipes(), loadAdminUsers()]);
	return { recipes, users };
};
