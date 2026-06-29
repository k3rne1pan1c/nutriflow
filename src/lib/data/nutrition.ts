import type { DailyNutrition } from '$lib/types';

export const weeklyNutrition: DailyNutrition[] = [
	{ day: 'Mon', score: 92, calories: 1980, calorieTarget: 2100 },
	{ day: 'Tue', score: 88, calories: 2040, calorieTarget: 2100 },
	{ day: 'Wed', score: 95, calories: 1890, calorieTarget: 2100 },
	{ day: 'Thu', score: 90, calories: 2010, calorieTarget: 2100 },
	{ day: 'Fri', score: 86, calories: 2150, calorieTarget: 2100 },
	{ day: 'Sat', score: 91, calories: 1950, calorieTarget: 2100 },
	{ day: 'Sun', score: 93, calories: 1920, calorieTarget: 2100 }
];

export const todayNutritionScore = 92;

export const macroTargets = {
	calories: 2100,
	protein: 140,
	carbs: 210,
	fat: 70,
	fiber: 35
};

export const todayMacros = {
	calories: 1600,
	protein: 108,
	carbs: 168,
	fat: 56,
	fiber: 29
};

export const hydration = {
	goalGlasses: 8,
	currentGlasses: 5
};
