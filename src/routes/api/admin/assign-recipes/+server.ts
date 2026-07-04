import { json, error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin';
import { assignRecipesToUsers } from '$lib/server/adminData';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	await requireAdmin(locals.supabase, locals.user);

	const body = await request.json().catch(() => ({}));
	const recipeIds = Array.isArray(body.recipeIds) ? body.recipeIds.map(String) : [];
	const userIds = Array.isArray(body.userIds) ? body.userIds.map(String) : [];

	if (recipeIds.length === 0 || userIds.length === 0) {
		throw error(400, 'recipeIds and userIds are required');
	}

	try {
		const result = await assignRecipesToUsers(
			recipeIds,
			userIds,
			locals.user!.email ?? 'admin'
		);
		return json(result);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Assignment failed';
		throw error(500, message);
	}
};
