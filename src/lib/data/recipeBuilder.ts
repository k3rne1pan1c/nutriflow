// SEED SOURCE ONLY — helper for scripts/seed-catalog.ts recipe definitions.
import type { MealType, Recipe, RecipeIngredient, Nutrition } from '$lib/types';

type RecipeInput = {
	id: string;
	title: string;
	description: string;
	cuisine: string;
	mealType: MealType;
	image: string;
	prepTime: number;
	cookTime: number;
	difficulty: Recipe['difficulty'];
	baseServings: number;
	nutrition: Nutrition;
	tags: string[];
	ingredients: RecipeIngredient[];
	instructions: string[];
	healthBenefits?: string[];
	substitutions?: { from: string; to: string }[];
	mealPrepTips?: string[];
	favorite?: boolean;
};

export function defineRecipe(input: RecipeInput): Recipe {
	return {
		...input,
		healthBenefits: input.healthBenefits ?? ['Balanced nutrients for everyday wellness'],
		substitutions: input.substitutions ?? [],
		mealPrepTips: input.mealPrepTips ?? []
	};
}
