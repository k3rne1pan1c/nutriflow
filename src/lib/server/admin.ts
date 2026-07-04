import { error } from '@sveltejs/kit';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function getUserIsAdmin(
	supabase: SupabaseClient,
	userId: string
): Promise<boolean> {
	const { data, error: dbError } = await supabase
		.from('profiles')
		.select('is_admin')
		.eq('id', userId)
		.single();

	if (dbError) return false;
	return Boolean(data?.is_admin);
}

export async function requireAdmin(
	supabase: SupabaseClient | null,
	user: User | null | undefined
): Promise<User> {
	if (!user?.id) error(401, 'Unauthorized');
	if (!supabase) error(503, 'Database not configured');

	const isAdmin = await getUserIsAdmin(supabase, user.id);
	if (!isAdmin) {
		error(403, 'Admin access required');
	}

	return user;
}
