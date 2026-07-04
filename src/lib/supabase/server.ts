import { createServerClient } from '@supabase/ssr';
import { env as publicEnv } from '$env/dynamic/public';
import type { Cookies } from '@sveltejs/kit';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function createSupabaseServerClient(cookies: Cookies) {
	return createServerClient(publicEnv.PUBLIC_SUPABASE_URL!, publicEnv.PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, {
						...options,
						path: '/',
						// Keep auth cookies around across dev restarts (Supabase refresh token)
						maxAge: options.maxAge ?? ONE_YEAR_SECONDS,
						sameSite: 'lax'
					});
				});
			}
		}
	});
}
