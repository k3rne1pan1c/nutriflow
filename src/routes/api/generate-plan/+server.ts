import { json, error } from '@sveltejs/kit';
import { generateWeeklyPlan } from '$lib/server/ai/generatePlan';
import { persistGeneratedRecipes } from '$lib/server/persistRecipes';
import { isSupabaseConfigured } from '$lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { HouseholdMember, Ingredient, Recipe, UserProfile } from '$lib/types';
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

export const POST: RequestHandler = async ({ locals }) => {
	if (!isSupabaseConfigured() || !locals.supabase || !locals.session) {
		throw error(401, 'Unauthorized');
	}

	const userId = locals.session.user.id;
	const supabase = locals.supabase;

	await checkDailyLimit(supabase, userId);

	const [profileRes, householdRes, pantryRes, ingredientsRes] = await Promise.all([
		supabase.from('profiles').select('profile_data').eq('id', userId).single(),
		supabase.from('household_members').select('data').eq('user_id', userId),
		supabase.from('pantry_items').select('ingredient_id').eq('user_id', userId),
		supabase.from('ingredients').select('id, name, category, unit, emoji')
	]);

	const profile = (profileRes.data?.profile_data ?? {}) as UserProfile;
	if (!profileRes.data || profileRes.error) {
		throw error(400, 'Complete onboarding first');
	}

	const household = (householdRes.data?.map((r) => ({
		...(r.data as HouseholdMember),
		disabledForWeek: (r.data as HouseholdMember).disabledForWeek ?? null
	})) ?? []);
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

	let plan: Awaited<ReturnType<typeof generateWeeklyPlan>>;
	try {
		plan = await generateWeeklyPlan({
			profile,
			household,
			pantryIds,
			ingredients,
			ingredientMap
		});
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Plan generation failed';
		throw error(500, message);
	}

	try {
		await persistGeneratedRecipes(supabase, plan.recipes, userId);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Failed to save generated recipes';
		throw error(500, message);
	}

	await supabase.from('meal_plans').update({ is_active: false }).eq('user_id', userId);

	const weekStart = plan.plan[0]?.date ?? new Date().toISOString().slice(0, 10);
	const { data: saved, error: saveError } = await supabase
		.from('meal_plans')
		.insert({
			user_id: userId,
			week_start: weekStart,
			days: plan.plan,
			checked_shopping: [],
			is_active: true
		})
		.select('id')
		.single();

	if (saveError) throw error(500, saveError.message);

	await supabase.from('plan_generations').insert({ user_id: userId });

	return json({
		plan: plan.plan,
		planId: saved.id,
		source: plan.source,
		generatedRecipes: plan.recipes,
		debug: plan.debug
	});
};
