import { env } from '$env/dynamic/private';
import type { PlannedDay } from '$lib/types';

export function isAiDebugEnabled(): boolean {
	const flag = (env.AI_DEBUG ?? '').trim();
	return flag === 'true' || flag === '1';
}

export type AiDebugInfo = {
	model: string;
	durationMs: number;
	source: 'ai' | 'mock' | 'mock-fallback';
	catalogSize: number;
	poolSize: number;
	/** How many slots match what deterministic mock rotation would pick */
	mockMatchCount: number;
	/** How many slots differ from mock rotation */
	mockDiffCount: number;
	/** Slots where post-validation changed the AI pick */
	validationOverrideCount: number;
	rawResponse?: unknown;
	aiPicks?: { day: string; mealType: string; recipeId: string; reason?: string }[];
	finalPicks?: { day: string; mealType: string; recipeId: string; reason?: string }[];
};

export function logAi(event: string, data: Record<string, unknown>) {
	console.info(`[nutriflow:ai] ${event}`, data);
}

export function logAiJson(event: string, data: Record<string, unknown>) {
	console.info(`[nutriflow:ai] ${event}\n${JSON.stringify(data, null, 2)}`);
}

export function flattenMealPicks(plan: PlannedDay[]) {
	return plan.flatMap((day) =>
		day.meals
			.filter((m) => m.recipeId)
			.map((m) => ({
				day: day.day,
				mealType: m.mealType,
				recipeId: m.recipeId,
				reason: m.reason
			}))
	);
}

export function countMockDiff(mockPlan: PlannedDay[], finalPlan: PlannedDay[]): number {
	const mockMap = new Map(
		flattenMealPicks(mockPlan).map((m) => [`${m.day}:${m.mealType}`, m.recipeId])
	);
	let diff = 0;
	for (const m of flattenMealPicks(finalPlan)) {
		if (mockMap.get(`${m.day}:${m.mealType}`) !== m.recipeId) diff++;
	}
	return diff;
}

export function countValidationOverrides(
	aiPlan: PlannedDay[],
	finalPlan: PlannedDay[]
): number {
	const aiMap = new Map(
		flattenMealPicks(aiPlan).map((m) => [`${m.day}:${m.mealType}`, m.recipeId])
	);
	let overrides = 0;
	for (const m of flattenMealPicks(finalPlan)) {
		const aiId = aiMap.get(`${m.day}:${m.mealType}`);
		if (aiId && aiId !== m.recipeId) overrides++;
	}
	return overrides;
}

export function aiPlanFromRawDays(
	rawDays: { day: string; date: string; meals: { mealType: string; recipeId: string; reason?: string }[] }[],
	skeleton: PlannedDay[]
): PlannedDay[] {
	return skeleton.map((skel, i) => {
		const aiDay = rawDays[i];
		return {
			...skel,
			meals: skel.meals.map((slot) => {
				const aiMeal = aiDay?.meals.find((m) => m.mealType === slot.mealType);
				return {
					mealType: slot.mealType,
					recipeId: aiMeal?.recipeId ?? '',
					reason: aiMeal?.reason
				};
			})
		};
	});
}

export function buildDebugPayload(debug: AiDebugInfo): AiDebugInfo | undefined {
	if (!isAiDebugEnabled()) return undefined;
	return debug;
}
