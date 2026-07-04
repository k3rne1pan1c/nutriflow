import { createBrowserClient } from '@supabase/ssr';
import { env as publicEnv } from '$env/dynamic/public';

export function isSupabaseConfigured(): boolean {
	return Boolean(publicEnv.PUBLIC_SUPABASE_URL && publicEnv.PUBLIC_SUPABASE_ANON_KEY);
}

export function createSupabaseBrowserClient() {
	if (!isSupabaseConfigured()) {
		throw new Error('Supabase is not configured');
	}
	return createBrowserClient(publicEnv.PUBLIC_SUPABASE_URL!, publicEnv.PUBLIC_SUPABASE_ANON_KEY!);
}
