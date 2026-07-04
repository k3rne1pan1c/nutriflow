import type { PlannedDay, PlannedMeal } from '$lib/types';

export function countFilledMeals(plan: PlannedDay[]): number {
	return plan.reduce(
		(n, day) => n + day.meals.filter((m) => Boolean(m.recipeId)).length,
		0
	);
}

export function planHasFilledMeals(plan: PlannedDay[]): boolean {
	return countFilledMeals(plan) > 0;
}

export function countReviewedMeals(plan: PlannedDay[]): number {
	return plan.reduce(
		(n, day) => n + day.meals.filter((m) => m.recipeId && m.review).length,
		0
	);
}

export function countDislikedMeals(plan: PlannedDay[]): number {
	return plan.reduce(
		(n, day) => n + day.meals.filter((m) => m.recipeId && m.review === 'disliked').length,
		0
	);
}

export function iterFilledMeals(
	plan: PlannedDay[]
): { dayIndex: number; meal: PlannedMeal }[] {
	const items: { dayIndex: number; meal: PlannedMeal }[] = [];
	plan.forEach((day, dayIndex) => {
		for (const meal of day.meals) {
			if (meal.recipeId) items.push({ dayIndex, meal });
		}
	});
	return items;
}
