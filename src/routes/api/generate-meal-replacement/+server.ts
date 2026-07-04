import { json, error } from '@sveltejs/kit';
import { generateMealReplacement } from '$lib/server/ai/generatePlan';
import { persistGeneratedRecipes } from '$lib/server/persistRecipes';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { HouseholdMember, Ingredient, MealType, PlannedDay, UserProfile } from '$lib/types';
import type { RequestHandler } from './$types';

const DAILY_LIMIT = 25;

async function checkDailyLimit(supabase: SupabaseClient, userId: string) {
	const since = new Date();
	since.setHours(0, 0, 0, 0);

	const { count } = await supabase
		.from('plan_generations')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', userId)
		.gte('created_at', since.toISOString());

	if ((count ?? 0) >= DAILY_LIMIT) {
		throw error(
			429,
			`NutriFlow daily limit (${DAILY_LIMIT} generations). This is separate from your Google API quota — try again tomorrow.`
		);
	}
}

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!isSupabaseConfigured() || !locals.supabase || !locals.session) {
		throw error(401, 'Unauthorized');
	}

	const body = await request.json().catch(() => ({}));
	const dayIndex = body.dayIndex;
	const mealType = body.mealType as MealType | undefined;
	const clientPlan = body.plan as PlannedDay[] | undefined;

	if (typeof dayIndex !== 'number' || dayIndex < 0 || dayIndex > 6) {
		throw error(400, 'Invalid dayIndex');
	}
	if (!mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
		throw error(400, 'Invalid mealType');
	}

	const userId = locals.session.user.id;
	const supabase = locals.supabase;

	await checkDailyLimit(supabase, userId);

	const [profileRes, householdRes, pantryRes, ingredientsRes, planRes] = await Promise.all([
		supabase.from('profiles').select('profile_data').eq('id', userId).single(),
		supabase.from('household_members').select('data').eq('user_id', userId),
		supabase.from('pantry_items').select('ingredient_id').eq('user_id', userId),
		supabase.from('ingredients').select('id, name, category, unit, emoji'),
		supabase
			.from('meal_plans')
			.select('days')
			.eq('user_id', userId)
			.eq('is_active', true)
			.maybeSingle()
	]);

	const profile = (profileRes.data?.profile_data ?? {}) as UserProfile;
	if (!profileRes.data || profileRes.error) {
		throw error(400, 'Complete onboarding first');
	}

	const household =
		householdRes.data?.map((r) => ({
			...(r.data as HouseholdMember),
			disabledForWeek: (r.data as HouseholdMember).disabledForWeek ?? null
		})) ?? [];
	const pantryIds = pantryRes.data?.map((p) => p.ingredient_id) ?? [];
	const ingredients: Ingredient[] =
		ingredientsRes.data?.map((row) => ({
			id: row.id,
			name: row.name,
			category: row.category as Ingredient['category'],
			unit: row.unit as Ingredient['unit'],
			emoji: row.emoji ?? undefined
		})) ?? [];
	const ingredientMap = Object.fromEntries(ingredients.map((i) => [i.id, { name: i.name }]));

	if (ingredients.length === 0) {
		throw error(503, 'Ingredient catalog is empty. Run pnpm run seed.');
	}

	const currentPlan = clientPlan?.length ? clientPlan : ((planRes.data?.days as PlannedDay[]) ?? []);
	if (!currentPlan.length) {
		throw error(400, 'No active meal plan');
	}

	const meal = currentPlan[dayIndex]?.meals.find((m) => m.mealType === mealType);
	if (!meal?.recipeId) {
		throw error(400, 'Meal slot not found');
	}

	let result: Awaited<ReturnType<typeof generateMealReplacement>>;
	try {
		result = await generateMealReplacement({
			profile,
			household,
			pantryIds,
			ingredients,
			ingredientMap,
			mealType,
			dayIndex,
			currentPlan,
			excludeRecipeId: meal.recipeId
		});
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Meal generation failed';
		throw error(500, message);
	}

	try {
		await persistGeneratedRecipes(supabase, [result.recipe], userId);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Failed to save generated recipe';
		throw error(500, message);
	}

	await supabase.from('plan_generations').insert({ user_id: userId });

	return json({
		recipeId: result.recipeId,
		reason: result.reason,
		source: result.source,
		recipe: result.recipe,
		debug: result.debug
	});
};
