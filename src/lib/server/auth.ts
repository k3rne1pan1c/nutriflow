import { env } from '$env/dynamic/private';

/** Enable instant email+password login for local dev (server-only). */
export const isDevAuth = env.DEV_AUTH === 'true' || env.DEV_AUTH === '1';

export const devAuthPassword = env.DEV_AUTH_PASSWORD || 'nutriflow-dev';
