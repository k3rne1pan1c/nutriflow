import { json, error } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin';
import { setUserAdmin } from '$lib/server/adminData';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const admin = await requireAdmin(locals.supabase, locals.user);

	const body = await request.json().catch(() => ({}));
	const userId = typeof body.userId === 'string' ? body.userId : '';
	const isAdmin = Boolean(body.isAdmin);

	if (!userId) {
		throw error(400, 'userId is required');
	}

	if (userId === admin.id && !isAdmin) {
		throw error(400, 'You cannot remove your own admin access');
	}

	try {
		await setUserAdmin(userId, isAdmin, admin.email ?? 'admin');
		return json({ ok: true, userId, isAdmin });
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Failed to update admin status';
		throw error(500, message);
	}
};
