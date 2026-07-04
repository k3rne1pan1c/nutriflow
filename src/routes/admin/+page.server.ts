import { loadAdminOverview } from '$lib/server/adminData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const overview = await loadAdminOverview();
	return { overview };
};
