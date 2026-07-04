import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';

let adminClient: SupabaseClient | null = null;

export function createSupabaseAdmin(): SupabaseClient {
	if (adminClient) return adminClient;

	const url = publicEnv.PUBLIC_SUPABASE_URL;
	const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !serviceKey) {
		throw new Error('SUPABASE_SERVICE_ROLE_KEY and PUBLIC_SUPABASE_URL are required for admin');
	}

	adminClient = createClient(url, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false }
	}) as SupabaseClient;

	return adminClient;
}
