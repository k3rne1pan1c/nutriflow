import { GoogleGenAI } from '@google/genai';
import { getAiConfig } from '$lib/server/env';

/** Same family as `gemini-flash-latest` in the REST API / AI Studio curl examples. */
const DEFAULT_MODEL = 'gemini-flash-latest';

const FALLBACK_MODELS = ['gemini-3-flash-preview'];

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function modelsToTry(preferred: string): string[] {
	return [...new Set([preferred || DEFAULT_MODEL, DEFAULT_MODEL, ...FALLBACK_MODELS].filter(Boolean))];
}

function parseApiError(e: unknown): { status?: number; message: string; from: 'gemini' | 'unknown' } {
	if (e && typeof e === 'object') {
		const err = e as { status?: number; message?: string };
		const message = err.message ?? String(e);
		if (typeof err.status === 'number') {
			return { status: err.status, message, from: 'gemini' };
		}
		return { message, from: 'unknown' };
	}
	if (e instanceof Error) return { message: e.message, from: 'unknown' };
	return { message: String(e), from: 'unknown' };
}

export function formatGeminiError(e: unknown): string {
	const { status, message } = parseApiError(e);
	if (status === 429) {
		return 'Google Gemini rate limit — wait a minute or check quota at aistudio.google.com';
	}
	if (status === 503) return 'Gemini model busy — try again in a moment';
	if (status === 404) return `Gemini model not found — set GEMINI_MODEL=gemini-flash-latest in .env (${message})`;
	return message;
}

function isRetryable(e: unknown): boolean {
	const { status } = parseApiError(e);
	return status === 503 || status === 500;
}

/**
 * Calls Gemini via @google/genai, which hits:
 * https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 * (same host/path as the REST curl from AI Studio)
 */
export async function generateGeminiJson(
	prompt: string,
	responseSchema: Record<string, unknown>,
	label = 'request'
): Promise<{ text: string; model: string; durationMs: number }> {
	const { geminiApiKey, geminiModel } = getAiConfig();
	if (!geminiApiKey) {
		throw new Error('GEMINI_API_KEY is not set in .env');
	}

	const ai = new GoogleGenAI({ apiKey: geminiApiKey });
	const models = modelsToTry(geminiModel);
	let lastError: unknown;
	const started = Date.now();

	for (const model of models) {
		try {
			const response = await ai.models.generateContent({
				model,
				contents: prompt,
				config: {
					responseMimeType: 'application/json',
					responseSchema
				}
			});
			const text = response.text;
			if (!text) throw new Error('Empty AI response');
			const durationMs = Date.now() - started;
			console.info(
				`[gemini] ok label=${label} model=${model} ms=${durationMs} chars=${text.length}`
			);
			console.info(`[gemini] raw label=${label} model=${model}:\n${text}`);
			return { text, model, durationMs };
		} catch (e) {
			lastError = e;
			const { status, message } = parseApiError(e);
			console.warn(`[gemini] fail label=${label} model=${model} status=${status ?? '?'}:`, message);
			if (status === 429 || status === 400 || status === 404) break;
			if (isRetryable(e)) await sleep(1500);
		}
	}

	throw new Error(`Gemini request failed: ${formatGeminiError(lastError)}`);
}

export const weeklyPlanResponseSchema = {
	type: 'object',
	properties: {
		days: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					day: { type: 'string' },
					date: { type: 'string' },
					meals: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								mealType: { type: 'string' },
								recipeId: { type: 'string' },
								reason: { type: 'string' }
							},
							required: ['mealType', 'recipeId']
						}
					}
				},
				required: ['day', 'date', 'meals']
			}
		}
	},
	required: ['days']
} as const;

export const mealReplacementResponseSchema = {
	type: 'object',
	properties: {
		recipeId: { type: 'string' },
		reason: { type: 'string' }
	},
	required: ['recipeId', 'reason']
} as const;
