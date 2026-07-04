import { createSupabaseServerClient } from '$lib/supabase/server';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!isSupabaseConfigured()) {
		event.locals.supabase = null;
		event.locals.session = null;
		event.locals.user = null;
		return resolve(event);
	}

	const supabase = createSupabaseServerClient(event.cookies);
	event.locals.supabase = supabase;

	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) {
		event.locals.session = null;
		event.locals.user = null;
	} else {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (error || !user) {
			event.locals.session = null;
			event.locals.user = null;
		} else {
			event.locals.session = session;
			event.locals.user = user;
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
