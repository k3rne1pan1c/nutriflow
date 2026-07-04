import type { HouseholdMember, MealType, PlannedDay, Recipe, UserProfile } from '$lib/types';
import { buildWeekSkeleton } from '$lib/plan/mockPlan';
import { getAiConfig } from '$lib/server/env';
import { logAi } from '$lib/server/aiLog';
import type { AiDebugInfo } from '$lib/server/aiLog';
import { buildDebugPayload } from '$lib/server/aiLog';
import {
	collectPlanTitles,
	generateSingleRecipe,
	generateWeekOfRecipes,
	type RecipeGenerationContext
} from '$lib/server/ai/generateRecipe';

export interface GeneratePlanInput {
	profile: UserProfile;
	household: HouseholdMember[];
	pantryIds: string[];
	recipes?: Recipe[];
	ingredients?: import('$lib/types').Ingredient[];
	ingredientMap?: Record<string, { name: string }>;
}

export type PlanSource = 'mock' | 'ai';

export interface GenerateMealReplacementInput extends GeneratePlanInput {
	mealType: MealType;
	dayIndex: number;
	currentPlan: PlannedDay[];
	excludeRecipeId: string;
}

function recipeCtx(input: GeneratePlanInput): RecipeGenerationContext {
	return {
		profile: input.profile,
		household: input.household,
		pantryIds: input.pantryIds,
		ingredients: input.ingredients ?? [],
		ingredientMap: input.ingredientMap ?? {}
	};
}

export async function generateMealReplacement(
	input: GenerateMealReplacementInput
): Promise<{
	recipeId: string;
	reason: string;
	source: PlanSource;
	recipe: Recipe;
	debug?: AiDebugInfo;
}> {
	const ctx = recipeCtx(input);
	if (ctx.ingredients.length === 0) {
		throw new Error('Ingredient catalog is empty. Run pnpm run seed.');
	}

	const day = input.currentPlan[input.dayIndex];
	const current = input.currentPlan
		.flatMap((d) => d.meals)
		.find((m) => m.recipeId === input.excludeRecipeId);
	const excludeTitles = [
		current?.recipe?.title,
		...collectPlanTitles(input.currentPlan)
	].filter(Boolean) as string[];

	const { isAiMock } = getAiConfig();
	const { recipe, reason } = await generateSingleRecipe(input.mealType, ctx, {
		dayLabel: day?.day ?? 'Today',
		excludeTitles,
		weekTitles: collectPlanTitles(input.currentPlan)
	});

	return {
		recipeId: recipe.id,
		reason,
		source: isAiMock ? 'mock' : 'ai',
		recipe,
		debug: buildDebugPayload({
			model: isAiMock ? 'mock' : 'gemini',
			durationMs: 0,
			source: isAiMock ? 'mock' : 'ai',
			catalogSize: input.recipes?.length ?? 0,
			poolSize: 0,
			mockMatchCount: 0,
			mockDiffCount: 0,
			validationOverrideCount: 0,
			finalPicks: [{ day: day?.day ?? '', mealType: input.mealType, recipeId: recipe.id, reason }]
		})
	};
}

export async function generateWeeklyPlan(
	input: GeneratePlanInput
): Promise<{ plan: PlannedDay[]; source: PlanSource; recipes: Recipe[]; debug?: AiDebugInfo }> {
	const ctx = recipeCtx(input);
	if (ctx.ingredients.length === 0) {
		throw new Error('Ingredient catalog is empty. Run pnpm run seed.');
	}

	const skeleton = buildWeekSkeleton();
	const { isAiMock } = getAiConfig();

	logAi('weekly-plan:create-recipes', {
		isAiMock,
		ingredientCount: ctx.ingredients.length,
		mode: 'original-ai-recipes'
	});

	const { plan, recipes } = await generateWeekOfRecipes(skeleton, ctx);

	return {
		plan,
		source: isAiMock ? 'mock' : 'ai',
		recipes,
		debug: buildDebugPayload({
			model: isAiMock ? 'mock' : 'gemini',
			durationMs: 0,
			source: isAiMock ? 'mock' : 'ai',
			catalogSize: input.recipes?.length ?? 0,
			poolSize: 0,
			mockMatchCount: 0,
			mockDiffCount: recipes.length,
			validationOverrideCount: 0,
			finalPicks: plan.flatMap((d) =>
				d.meals.map((m) => ({
					day: d.day,
					mealType: m.mealType,
					recipeId: m.recipeId,
					reason: m.reason
				}))
			)
		})
	};
}
