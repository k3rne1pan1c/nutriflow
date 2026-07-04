import type { HouseholdMember, Recipe, UserProfile } from '$lib/types';
import {
	activeMembersForWeek,
	parseAvoidTerms,
	strictestDiet
} from '$lib/household';

const ALLERGEN_INGREDIENTS: Record<string, string[]> = {
	Dairy: ['milk', 'yogurt', 'greek-yogurt', 'cheese', 'butter', 'cream'],
	Eggs: ['eggs'],
	Gluten: ['bread', 'oats', 'pasta', 'flour', 'tortilla'],
	Peanuts: ['peanut-butter'],
	'Tree Nuts': ['almonds', 'walnuts'],
	Shellfish: ['shrimp'],
	Fish: ['salmon', 'shrimp'],
	Soy: ['tofu', 'soy-sauce'],
	Sesame: ['sesame-seeds']
};

const DIET_EXCLUDED_INGREDIENTS: Record<string, string[]> = {
	Vegan: [
		'milk',
		'yogurt',
		'greek-yogurt',
		'cheese',
		'butter',
		'cream',
		'eggs',
		'salmon',
		'turkey',
		'chicken-breast',
		'ground-beef',
		'shrimp'
	],
	Vegetarian: ['salmon', 'turkey', 'chicken-breast', 'ground-beef', 'shrimp'],
	Pescatarian: ['turkey', 'chicken-breast', 'ground-beef']
};

function recipeIngredientIds(recipe: Recipe): string[] {
	return recipe.ingredients.map((i) => i.ingredientId);
}

function hasExcludedIngredient(recipe: Recipe, excluded: string[]): boolean {
	const ids = recipeIngredientIds(recipe);
	return excluded.some((id) => ids.includes(id));
}

function conflictsAllergies(recipe: Recipe, allergies: string[]): boolean {
	for (const allergy of allergies) {
		const blocked = ALLERGEN_INGREDIENTS[allergy];
		if (blocked && hasExcludedIngredient(recipe, blocked)) return true;
	}
	return false;
}

function conflictsAvoid(
	recipe: Recipe,
	avoidTerms: string[],
	ingredientMap: Record<string, { name: string }>
): boolean {
	if (avoidTerms.length === 0) return false;
	for (const ing of recipe.ingredients) {
		const name = (ingredientMap[ing.ingredientId]?.name ?? ing.ingredientId).toLowerCase();
		const id = ing.ingredientId.toLowerCase();
		if (avoidTerms.some((term) => name.includes(term) || id.includes(term))) return true;
	}
	return false;
}

function collectAllergies(profile: UserProfile, members: HouseholdMember[]): string[] {
	const set = new Set<string>(profile.allergies ?? []);
	for (const m of members) {
		for (const a of m.allergies ?? []) set.add(a);
	}
	return [...set];
}

function collectAvoidTerms(profile: UserProfile, members: HouseholdMember[]): string[] {
	const terms = new Set(parseAvoidTerms(profile.avoid));
	for (const m of members) {
		for (const t of parseAvoidTerms(m.avoid)) terms.add(t);
	}
	return [...terms];
}

export interface FilterContext {
	profile: UserProfile;
	household: HouseholdMember[];
	pantryIds: string[];
	weekStart?: string | null;
	ingredientMap?: Record<string, { name: string }>;
}

export function filterRecipes(recipes: Recipe[], ctx: FilterContext): Recipe[] {
	const maxTime = ctx.profile.maxCookingTime ?? 60;
	const active = activeMembersForWeek(ctx.household, ctx.weekStart ?? null);
	const diets = [
		...(ctx.profile.diet ? [ctx.profile.diet] : []),
		...active.map((m) => m.diet).filter(Boolean)
	];
	const diet = strictestDiet(diets);
	const dietExcluded = diet ? (DIET_EXCLUDED_INGREDIENTS[diet] ?? []) : [];
	const allergies = collectAllergies(ctx.profile, active);
	const avoidTerms = collectAvoidTerms(ctx.profile, active);
	const ingredientMap = ctx.ingredientMap ?? {};

	return recipes.filter((recipe) => {
		const totalTime = recipe.prepTime + recipe.cookTime;
		if (totalTime > maxTime) return false;
		if (dietExcluded.length && hasExcludedIngredient(recipe, dietExcluded)) return false;
		if (conflictsAllergies(recipe, allergies)) return false;
		if (conflictsAvoid(recipe, avoidTerms, ingredientMap)) return false;
		return true;
	});
}

export function filterRecipesStrictCuisine(recipes: Recipe[], cuisines: string[]): Recipe[] {
	if (cuisines.length === 0) return recipes;
	const matched = recipes.filter((r) => cuisines.includes(r.cuisine));
	return matched.length >= 10 ? matched : recipes;
}

export type RecipeSummary = {
	id: string;
	title: string;
	mealType: string;
	cuisine: string;
	tags: string[];
	totalMinutes: number;
	calories: number;
};

export function toRecipeSummary(recipe: Recipe): RecipeSummary {
	return {
		id: recipe.id,
		title: recipe.title,
		mealType: recipe.mealType,
		cuisine: recipe.cuisine,
		tags: recipe.tags,
		totalMinutes: recipe.prepTime + recipe.cookTime,
		calories: recipe.nutrition.calories
	};
}

export function summarizeIngredients(
	recipe: Recipe,
	ingredientMap: Record<string, { name: string }>
): string {
	return recipe.ingredients
		.map((i) => ingredientMap[i.ingredientId]?.name ?? i.ingredientId)
		.join(', ');
}
