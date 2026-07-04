import type {
	DailyNutrition,
	HouseholdMember,
	Micronutrients,
	PlannedDay,
	Recipe,
	UserProfile
} from '$lib/types';
import { weekDays } from '$lib/meta';
import { householdServingFactor, memberToProfile, mealServingFactor } from '$lib/household';

const DEFAULT_CALORIE_TARGET = 2100;

export type NutrientStatus = 'wellCovered' | 'moderate' | 'low';

export interface NutrientSummary {
	key: keyof Micronutrients;
	label: string;
	total: number;
	weeklyTarget: number;
	unit: string;
	status: NutrientStatus;
}

export interface WeeklyMacroSummary {
	protein: number;
	fiber: number;
	proteinTarget: number;
	fiberTarget: number;
}

const WEEKLY_RDA: Record<keyof Micronutrients, { amount: number; unit: string; label: string }> = {
	omega3Mg: { amount: 1750, unit: 'mg', label: 'Omega-3' },
	calciumMg: { amount: 7000, unit: 'mg', label: 'Calcium' },
	ironMg: { amount: 126, unit: 'mg', label: 'Iron' },
	magnesiumMg: { amount: 2800, unit: 'mg', label: 'Magnesium' },
	vitaminAMcg: { amount: 6300, unit: 'mcg', label: 'Vitamin A' },
	vitaminCMg: { amount: 630, unit: 'mg', label: 'Vitamin C' },
	vitaminDMcg: { amount: 350, unit: 'mcg', label: 'Vitamin D' },
	folateMcg: { amount: 2800, unit: 'mcg', label: 'Folate' }
};

/** Rough per-serving micronutrient estimates when recipe data omits them. */
const INGREDIENT_MICRO: Record<string, Partial<Micronutrients>> = {
	salmon: { omega3Mg: 1200, vitaminDMcg: 8 },
	spinach: { ironMg: 2.7, magnesiumMg: 79, folateMcg: 194, vitaminAMcg: 469 },
	lentils: { ironMg: 3.3, folateMcg: 181, magnesiumMg: 36 },
	chickpeas: { ironMg: 2.9, folateMcg: 172, magnesiumMg: 48 },
	broccoli: { vitaminCMg: 89, calciumMg: 47, folateMcg: 63 },
	'greek-yogurt': { calciumMg: 110 },
	cheese: { calciumMg: 200 },
	eggs: { vitaminDMcg: 1, ironMg: 0.9 },
	oats: { ironMg: 1.5, magnesiumMg: 56 },
	almonds: { magnesiumMg: 76, calciumMg: 76 },
	'chia-seeds': { omega3Mg: 2500, calciumMg: 179, ironMg: 2.2 },
	blueberries: { vitaminCMg: 9 },
	orange: { vitaminCMg: 53 },
	'sweet-potato': { vitaminAMcg: 709 },
	kale: { vitaminCMg: 93, calciumMg: 150, vitaminAMcg: 500 }
};

export function estimateCalorieTarget(profile: UserProfile): number {
	if (!profile.weight || !profile.height || !profile.age || !profile.sex) {
		return DEFAULT_CALORIE_TARGET;
	}
	const bmr =
		profile.sex === 'Male'
			? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
			: 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
	const multipliers: Record<string, number> = {
		Sedentary: 1.2,
		Light: 1.375,
		Moderate: 1.55,
		Active: 1.725,
		Athlete: 1.9
	};
	const activity = profile.activity ? (multipliers[profile.activity] ?? 1.55) : 1.55;
	return Math.round(bmr * activity);
}

export function householdCalorieTarget(members: HouseholdMember[]): number {
	if (members.length === 0) return DEFAULT_CALORIE_TARGET;
	return members.reduce((sum, m) => sum + estimateCalorieTarget(memberToProfile(m)), 0);
}

function dayScore(calories: number, target: number): number {
	if (target <= 0) return 85;
	if (calories <= 0) return 0;
	const ratio = calories / target;
	if (ratio >= 0.9 && ratio <= 1.1) return 95;
	if (ratio >= 0.8 && ratio <= 1.2) return 88;
	if (ratio >= 0.7 && ratio <= 1.3) return 78;
	return 70;
}

/** Plain-language explanation of the daily balance score (0–100). */
export function describeDayScore(
	score: number,
	calories: number,
	target: number,
	hasMeals: boolean
): { title: string; detail: string } {
	if (!hasMeals || calories <= 0) {
		return {
			title: 'No meals yet',
			detail:
				'Generate your week to see how well each day matches your household calorie target. Higher scores mean the plan is closer to your goal.'
		};
	}
	const ratio = target > 0 ? calories / target : 1;
	const direction = ratio < 0.9 ? 'lighter' : ratio > 1.1 ? 'heavier' : 'on target';

	if (score >= 95) {
		return {
			title: 'On target',
			detail: `Today's plan is about ${calories.toLocaleString()} kcal — right around your ${target.toLocaleString()} kcal goal for the household.`
		};
	}
	if (score >= 88) {
		return {
			title: 'Well balanced',
			detail: `Today is slightly ${direction} your ${target.toLocaleString()} kcal goal (${calories.toLocaleString()} kcal planned).`
		};
	}
	if (score >= 78) {
		return {
			title: 'A bit off',
			detail: `Today is moderately ${direction} your goal at ${calories.toLocaleString()} kcal (target ~${target.toLocaleString()} kcal). Swap a meal on the plan page if you want to adjust.`
		};
	}
	return {
		title: 'Needs adjustment',
		detail: `Today is quite ${direction} your goal — ${calories.toLocaleString()} kcal planned vs ~${target.toLocaleString()} kcal target. Try replacing a meal or generating a new week.`
	};
}

function estimateRecipeMicronutrients(recipe: Recipe): Micronutrients {
	if (recipe.nutrition.micronutrients) return recipe.nutrition.micronutrients;
	const totals: Micronutrients = {};
	for (const ing of recipe.ingredients) {
		const micro = INGREDIENT_MICRO[ing.ingredientId];
		if (!micro) continue;
		const scale = ing.amountPerServing / 100;
		for (const [key, val] of Object.entries(micro)) {
			const k = key as keyof Micronutrients;
			if (val == null) continue;
			totals[k] = (totals[k] ?? 0) + val * scale;
		}
	}
	if (recipe.tags.includes('Omega-3')) totals.omega3Mg = (totals.omega3Mg ?? 0) + 200;
	if (recipe.tags.includes('Iron')) totals.ironMg = (totals.ironMg ?? 0) + 2;
	if (recipe.tags.includes('High Fiber')) totals.folateMcg = (totals.folateMcg ?? 0) + 30;
	return totals;
}

function addMicro(target: Micronutrients, source: Micronutrients, scale: number) {
	for (const [key, val] of Object.entries(source)) {
		const k = key as keyof Micronutrients;
		if (val == null) continue;
		target[k] = (target[k] ?? 0) + val * scale;
	}
}

export function computeWeeklyNutrition(
	plan: PlannedDay[],
	profile: UserProfile,
	recipeMap: Record<string, Recipe>,
	activeMembers: HouseholdMember[] = []
): DailyNutrition[] {
	const target =
		activeMembers.length > 0 ? householdCalorieTarget(activeMembers) : estimateCalorieTarget(profile);
	const factor = activeMembers.length > 0 ? householdServingFactor(activeMembers) : 1;
	return plan.map((day, i) => {
		const calories = day.meals.reduce((sum, meal) => {
			const recipe = recipeMap[meal.recipeId];
			return sum + (recipe?.nutrition.calories ?? 0) * factor;
		}, 0);
		return {
			day: weekDays[i] ?? day.day.slice(0, 3),
			score: dayScore(calories, target),
			calories: Math.round(calories),
			calorieTarget: target
		};
	});
}

export function computeTodayNutrition(
	plan: PlannedDay[],
	profile: UserProfile,
	todayIndex: number,
	recipeMap: Record<string, Recipe>,
	activeMembers: HouseholdMember[] = []
): { score: number; calories: number; target: number } {
	const weekly = computeWeeklyNutrition(plan, profile, recipeMap, activeMembers);
	const today = weekly[todayIndex] ?? weekly[0];
	return {
		score: today?.score ?? 85,
		calories: today?.calories ?? 0,
		target: today?.calorieTarget ?? DEFAULT_CALORIE_TARGET
	};
}

export function computeWeeklyMacros(
	plan: PlannedDay[],
	recipeMap: Record<string, Recipe>,
	activeMembers: HouseholdMember[]
): WeeklyMacroSummary {
	const factor = householdServingFactor(activeMembers) || 1;
	let protein = 0;
	let fiber = 0;
	for (const day of plan) {
		for (const meal of day.meals) {
			const recipe = recipeMap[meal.recipeId];
			if (!recipe) continue;
			const mealFactor = mealServingFactor(activeMembers, meal.mealType);
			protein += recipe.nutrition.protein * mealFactor;
			fiber += recipe.nutrition.fiber * mealFactor;
		}
	}
	const memberCount = Math.max(activeMembers.length, 1);
	return {
		protein: Math.round(protein),
		fiber: Math.round(fiber),
		proteinTarget: 70 * memberCount,
		fiberTarget: 25 * memberCount
	};
}

export function computeWeeklyMicronutrients(
	plan: PlannedDay[],
	recipeMap: Record<string, Recipe>,
	activeMembers: HouseholdMember[]
): Micronutrients {
	const totals: Micronutrients = {};
	for (const day of plan) {
		for (const meal of day.meals) {
			const recipe = recipeMap[meal.recipeId];
			if (!recipe) continue;
			const mealFactor = mealServingFactor(activeMembers, meal.mealType);
			const micro = estimateRecipeMicronutrients(recipe);
			addMicro(totals, micro, mealFactor);
		}
	}
	return totals;
}

function nutrientStatus(ratio: number): NutrientStatus {
	if (ratio >= 0.85) return 'wellCovered';
	if (ratio >= 0.6) return 'moderate';
	return 'low';
}

export function compareToRDA(
	totals: Micronutrients,
	activeMembers: HouseholdMember[]
): NutrientSummary[] {
	const memberFactor = Math.max(householdServingFactor(activeMembers), 1);
	return (Object.keys(WEEKLY_RDA) as (keyof Micronutrients)[]).map((key) => {
		const meta = WEEKLY_RDA[key];
		const weeklyTarget = meta.amount * memberFactor;
		const total = totals[key] ?? 0;
		const ratio = weeklyTarget > 0 ? total / weeklyTarget : 1;
		return {
			key,
			label: meta.label,
			total: Math.round(total),
			weeklyTarget: Math.round(weeklyTarget),
			unit: meta.unit,
			status: nutrientStatus(ratio)
		};
	});
}

export function getTodayIndex(plan: PlannedDay[]): number {
	if (plan.length === 0) return 0;
	const today = new Date().toISOString().slice(0, 10);
	const idx = plan.findIndex((d) => d.date === today);
	if (idx >= 0) return idx;
	const start = new Date(plan[0].date);
	const now = new Date();
	const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
	if (diff >= 0 && diff < plan.length) return diff;
	return 0;
}

export function getWeekStart(plan: PlannedDay[]): string | null {
	return plan[0]?.date ?? null;
}

export const hydrationGoalGlasses = 8;

export const macroTargets = {
	calories: 2100,
	protein: 140,
	carbs: 210,
	fat: 70,
	fiber: 35
};

export function sharedIngredients(
	plan: PlannedDay[],
	recipeMap: Record<string, Recipe>,
	ingredientMap: Record<string, { name: string }>,
	minMeals = 3
): { name: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const day of plan) {
		const dayIds = new Set<string>();
		for (const meal of day.meals) {
			const recipe = recipeMap[meal.recipeId];
			if (!recipe) continue;
			for (const ing of recipe.ingredients) dayIds.add(ing.ingredientId);
		}
		for (const id of dayIds) counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return [...counts.entries()]
		.filter(([, count]) => count >= minMeals)
		.map(([id, count]) => ({ name: ingredientMap[id]?.name ?? id, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);
}
