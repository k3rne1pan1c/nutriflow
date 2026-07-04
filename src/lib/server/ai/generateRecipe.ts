import type { HouseholdMember, Ingredient, MealType, PlannedDay, Recipe, UserProfile } from '$lib/types';
import { activeMembersForWeek } from '$lib/household';
import { householdCalorieTarget } from '$lib/nutrition';
import { mealOrder } from '$lib/meta';
import { getAiConfig } from '$lib/server/env';
import { generateGeminiJson } from '$lib/server/gemini';
import { logAi, logAiJson } from '$lib/server/aiLog';
import {
	dayRecipesResponseSchema,
	ingredientCatalogForPrompt,
	normalizeGeneratedRecipe,
	parseDayRecipesResponse,
	parseSingleRecipeResponse,
	singleRecipeResponseSchema
} from '$lib/server/ai/recipeSchema';
import type { PlannedMeal } from '$lib/types';

export interface RecipeGenerationContext {
	profile: UserProfile;
	household: HouseholdMember[];
	pantryIds: string[];
	ingredients: Ingredient[];
	ingredientMap: Record<string, { name: string }>;
}

function buildPreferenceBlock(ctx: RecipeGenerationContext, weekStart: string | null): string {
	const active = activeMembersForWeek(ctx.household, weekStart);
	const calorieTarget = householdCalorieTarget(active);
	return `User / household:
- Goals: ${(ctx.profile.goals ?? []).join(', ') || 'general health'}
- Diet: ${ctx.profile.diet ?? 'Omnivore'}
- Allergies: ${(ctx.profile.allergies ?? []).join(', ') || 'none'}
- Avoid: ${ctx.profile.avoid || 'none'}
- Cuisines: ${(ctx.profile.cuisines ?? []).join(', ') || 'any'}
- Max cooking time: ${ctx.profile.maxCookingTime ?? 45} min total (prep + cook)
- Experience: ${ctx.profile.experience ?? 'Beginner'}
- Equipment: ${(ctx.profile.equipment ?? []).join(', ') || 'standard kitchen'}
- Pantry ingredient IDs to prefer using: ${ctx.pantryIds.join(', ') || 'none'}
- Weekly household calorie target: ~${calorieTarget} kcal
- Active members: ${active.map((m) => `${m.name} (${m.diet}, avoid: ${(m.avoid ?? []).join('/') || 'none'})`).join('; ') || 'solo'}`;
}

	function mockRecipe(
	mealType: MealType,
	dayLabel: string,
	ctx: RecipeGenerationContext,
	index: number
): { recipe: Recipe; reason: string } {
	const a = ctx.ingredients[index % ctx.ingredients.length];
	const b = ctx.ingredients[(index + 3) % ctx.ingredients.length] ?? a;
	const title = `${dayLabel} ${mealType}: ${a.name} & ${b.name}`;
	const recipe = normalizeGeneratedRecipe(
		{
			title,
			description: `A balanced ${mealType} tailored to your preferences, built around ${a.name} and ${b.name}.`,
			cuisine: ctx.profile.cuisines?.[0] ?? 'International',
			prepTime: 10,
			cookTime: mealType === 'breakfast' ? 5 : 20,
			difficulty: 'Easy',
			baseServings: 2,
			nutrition: { calories: 420, protein: 22, carbs: 45, fat: 14, fiber: 8 },
			tags: ['AI generated', mealType],
			ingredients: [
				{ ingredientId: a.id, amountPerServing: 80, unit: a.unit === 'pcs' ? 'pcs' : 'g' },
				{ ingredientId: b.id, amountPerServing: 60, unit: b.unit === 'pcs' ? 'pcs' : 'g' }
			],
			instructions: [
				'Prep ingredients and measure portions.',
				'Cook the base according to your preferred method.',
				'Combine, season, and serve immediately.'
			],
			healthBenefits: ['Balanced macros for your household goals'],
			substitutions: [],
			mealPrepTips: ['Double the batch for leftovers']
		},
		mealType,
		ctx.ingredients
	);
	return {
		recipe,
		reason: `Custom ${mealType} designed for ${dayLabel} using your pantry and diet preferences.`
	};
}

export async function generateDayRecipes(
	day: PlannedDay,
	dayIndex: number,
	ctx: RecipeGenerationContext,
	weekTitles: string[]
): Promise<PlannedMeal[]> {
	const { isAiMock } = getAiConfig();
	const weekStart = day.date;

	if (isAiMock) {
		return mealOrder.map((mealType, i) => {
			const { recipe, reason } = mockRecipe(mealType, day.day, ctx, dayIndex + i);
			return {
				mealType,
				recipeId: recipe.id,
				reason,
				recipe
			};
		});
	}

	const prompt = `You are a creative nutrition chef. Invent ORIGINAL recipes — do NOT reuse generic meal names from a database.

${buildPreferenceBlock(ctx, weekStart)}

Day: ${day.day} (${day.date})
Create exactly 4 NEW recipes for: breakfast, lunch, dinner, snack.

Already planned this week (vary ingredients and cuisines): ${weekTitles.join(', ') || 'none yet'}

Available ingredients — use ONLY these ingredientId values:
${ingredientCatalogForPrompt(ctx.ingredients)}

Rules:
- Each recipe must be unique, practical, and match the mealType
- Respect diet, allergies, and avoid lists strictly
- Prefer pantry ingredients when possible
- Keep total prep+cook within max cooking time
- Include realistic nutrition estimates per serving
- difficulty must be exactly "Easy", "Medium", or "Hard"
- instructions: clear steps as array of strings
- Return JSON with meals array: each item has mealType, reason (one sentence), and full recipe object`;

	const { text, model, durationMs } = await generateGeminiJson(
		prompt,
		dayRecipesResponseSchema,
		`day-recipes:${day.day}`
	);

	const parsed = parseDayRecipesResponse(JSON.parse(text));
	const meals: PlannedMeal[] = [];

	for (const slot of mealOrder) {
		const item = parsed.meals.find((m) => m.mealType === slot);
		if (!item) throw new Error(`AI missed ${slot} for ${day.day}`);
		const recipe = normalizeGeneratedRecipe(item.recipe, slot, ctx.ingredients);
		meals.push({
			mealType: slot,
			recipeId: recipe.id,
			reason: item.reason,
			recipe
		});
	}

	logAiJson('day-recipes:done', {
		day: day.day,
		model,
		durationMs,
		titles: meals.map((m) => m.recipe?.title)
	});

	return meals;
}

export async function generateSingleRecipe(
	mealType: MealType,
	ctx: RecipeGenerationContext,
	options: {
		dayLabel: string;
		excludeTitles?: string[];
		weekTitles?: string[];
	}
): Promise<{ recipe: Recipe; reason: string }> {
	const { isAiMock } = getAiConfig();

	if (isAiMock) {
		return mockRecipe(mealType, options.dayLabel, ctx, 0);
	}

	const prompt = `You are a creative nutrition chef. Invent ONE completely NEW ${mealType} recipe.

${buildPreferenceBlock(ctx, null)}

Context: ${options.dayLabel} ${mealType}
Do NOT create anything similar to: ${options.excludeTitles?.join(', ') || 'n/a'}
Other meals this week: ${options.weekTitles?.join(', ') || 'n/a'}

Available ingredients — use ONLY these ingredientId values:
${ingredientCatalogForPrompt(ctx.ingredients)}

Return JSON with reason (one sentence) and full recipe object.`;

	const { text } = await generateGeminiJson(
		prompt,
		singleRecipeResponseSchema,
		`single-recipe:${mealType}`
	);

	const parsed = parseSingleRecipeResponse(JSON.parse(text));
	const recipe = normalizeGeneratedRecipe(parsed.recipe, mealType, ctx.ingredients);

	logAi('single-recipe:done', { title: recipe.title, mealType });

	return { recipe, reason: parsed.reason };
}

/** Run tasks with limited concurrency. */
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>) {
	const results: R[] = new Array(items.length);
	let next = 0;

	async function worker() {
		while (next < items.length) {
			const i = next++;
			results[i] = await fn(items[i], i);
		}
	}

	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return results;
}

export async function generateWeekOfRecipes(
	skeleton: PlannedDay[],
	ctx: RecipeGenerationContext
): Promise<{ plan: PlannedDay[]; recipes: Recipe[] }> {
	const weekTitles: string[] = [];

	const days = await mapPool(skeleton, 2, async (day, dayIndex) => {
		const meals = await generateDayRecipes(day, dayIndex, ctx, weekTitles);
		for (const m of meals) {
			if (m.recipe) weekTitles.push(m.recipe.title);
		}
		return { ...day, meals };
	});

	const recipes = days.flatMap((d) =>
		d.meals.map((m) => m.recipe).filter((r): r is Recipe => Boolean(r))
	);

	return { plan: days, recipes };
}

export function collectPlanTitles(plan: PlannedDay[]): string[] {
	return plan.flatMap((d) => d.meals.map((m) => m.recipe?.title).filter(Boolean)) as string[];
}
