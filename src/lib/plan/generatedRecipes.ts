import type { PlannedDay, Recipe } from '$lib/types';

export function extractGeneratedRecipesFromPlan(plan: PlannedDay[]): Recipe[] {
	const byId = new Map<string, Recipe>();
	for (const day of plan) {
		for (const meal of day.meals) {
			if (meal.recipe) byId.set(meal.recipe.id, meal.recipe);
		}
	}
	return [...byId.values()];
}

export function isGeneratedRecipeId(id: string): boolean {
	return id.startsWith('ai-');
}

export function mergeRecipeLists(catalog: Recipe[], generated: Recipe[]): Recipe[] {
	const map = new Map<string, Recipe>();
	for (const r of catalog) map.set(r.id, r);
	for (const r of generated) map.set(r.id, r);
	return [...map.values()];
}
