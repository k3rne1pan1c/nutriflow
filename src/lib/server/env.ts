import { env } from '$env/dynamic/private';

/** Read AI config fresh on each call (avoids stale module-level caching in dev). */
export function getAiConfig() {
	const mockFlag = (env.AI_MOCK ?? '').trim();
	return {
		isAiMock: mockFlag !== 'false' && mockFlag !== '0',
		geminiApiKey: (env.GEMINI_API_KEY ?? '').trim(),
		geminiModel: (env.GEMINI_MODEL ?? 'gemini-flash-latest').trim()
	};
}

/** @deprecated Use getAiConfig() — kept for any legacy imports */
export function isAiMockEnabled() {
	return getAiConfig().isAiMock;
}
