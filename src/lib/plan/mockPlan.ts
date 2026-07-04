import type { MealType, PlannedDay, Recipe } from '$lib/types';
import { mealOrder } from '$lib/meta';
import { buildFallbackReason } from '$lib/plan/scoreRecipes';

const DAY_NAMES = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
];

function startOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function formatDate(d: Date): string {
	return d.toISOString().slice(0, 10);
}

export function buildWeekSkeleton(start = new Date()): PlannedDay[] {
	const monday = startOfWeek(start);
	return DAY_NAMES.map((day, i) => {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);
		return {
			day,
			date: formatDate(date),
			meals: mealOrder.map((mealType) => ({ mealType: mealType as MealType, recipeId: '' }))
		};
	});
}

/** Deterministic mock plan — no API cost. */
export function mockPlanFromCatalog(eligible: Recipe[], pantryIds: string[] = []): PlannedDay[] {
	const byType = new Map<MealType, Recipe[]>();
	for (const r of eligible) {
		const list = byType.get(r.mealType) ?? [];
		list.push(r);
		byType.set(r.mealType, list);
	}

	const plan = buildWeekSkeleton();

	for (const day of plan) {
		for (const meal of day.meals) {
			const pool = byType.get(meal.mealType) ?? [];
			if (pool.length === 0) continue;
			const idx = plan.indexOf(day);
			const recipe = pool[(idx + mealOrder.indexOf(meal.mealType)) % pool.length];
			meal.recipeId = recipe.id;
			meal.reason = buildFallbackReason(recipe, pantryIds);
		}
	}
	return plan;
}
