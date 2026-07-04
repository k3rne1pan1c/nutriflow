import type { MealType, Recipe, UserProfile } from '$lib/types';

export interface ScoreContext {
	profile: UserProfile;
	pantryIds: string[];
	selectedIds: string[];
	userPrices?: Map<string, number>;
}

function ingredientOverlap(recipe: Recipe, selectedRecipes: Recipe[]): number {
	if (selectedRecipes.length === 0) return 0;
	const ids = new Set(recipe.ingredients.map((i) => i.ingredientId));
	let overlap = 0;
	for (const other of selectedRecipes) {
		for (const ing of other.ingredients) {
			if (ids.has(ing.ingredientId)) overlap++;
		}
	}
	return overlap;
}

function pantryOverlap(recipe: Recipe, pantryIds: string[]): number {
	return recipe.ingredients.filter((i) => pantryIds.includes(i.ingredientId)).length;
}

function estimatedCost(recipe: Recipe, prices: Map<string, number>): number {
	let cost = 0;
	for (const ing of recipe.ingredients) {
		cost += (prices.get(ing.ingredientId) ?? 0) * ing.amountPerServing;
	}
	return cost;
}

export function scoreRecipe(recipe: Recipe, ctx: ScoreContext, selectedRecipes: Recipe[]): number {
	let score = 50;
	const totalTime = recipe.prepTime + recipe.cookTime;
	const maxTime = ctx.profile.maxCookingTime ?? 60;
	if (totalTime <= maxTime * 0.7) score += 8;
	if (totalTime <= maxTime) score += 4;

	score += pantryOverlap(recipe, ctx.pantryIds) * 6;
	score += ingredientOverlap(recipe, selectedRecipes) * 4;

	if (recipe.nutrition.fiber >= 8) score += 5;
	if (recipe.nutrition.protein >= 20) score += 4;

	const cost = estimatedCost(recipe, ctx.userPrices ?? new Map());
	const budgetPerMeal = (ctx.profile.weeklyBudget ?? 120) / 28;
	if (cost > 0 && cost <= budgetPerMeal) score += 6;
	else if (cost > budgetPerMeal * 1.5) score -= 8;

	if ((ctx.profile.goals ?? []).some((g) => g.toLowerCase().includes('weight'))) {
		if (recipe.nutrition.calories < 450) score += 4;
	}
	if ((ctx.profile.goals ?? []).some((g) => g.toLowerCase().includes('muscle'))) {
		if (recipe.nutrition.protein >= 25) score += 6;
	}

	return score;
}

export function rankRecipesForMealType(
	recipes: Recipe[],
	mealType: MealType,
	ctx: ScoreContext,
	selectedRecipes: Recipe[],
	topN = 12
): Recipe[] {
	const pool = recipes.filter((r) => r.mealType === mealType);
	return pool
		.map((r) => ({ recipe: r, score: scoreRecipe(r, ctx, selectedRecipes) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, topN)
		.map((x) => x.recipe);
}

export function buildFallbackReason(recipe: Recipe, pantryIds: string[]): string {
	const pantryHits = recipe.ingredients.filter((i) => pantryIds.includes(i.ingredientId)).length;
	if (pantryHits >= 2) {
		return `Uses ${pantryHits} ingredients from your pantry and fits your preferences.`;
	}
	if (recipe.tags.includes('High Protein')) {
		return 'Selected for strong protein content to support your goals.';
	}
	if (recipe.tags.includes('High Fiber')) {
		return 'Chosen for fiber-rich ingredients that support gut health.';
	}
	if (recipe.nutrition.calories < 400) {
		return 'A lighter option that balances your weekly nutrition.';
	}
	return `A ${recipe.difficulty.toLowerCase()} ${recipe.mealType} that matches your household preferences.`;
}
