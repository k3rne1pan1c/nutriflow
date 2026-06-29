import type { PlannedDay } from '$lib/types';

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const mealPlan: PlannedDay[] = [
	{
		day: 'Monday',
		date: '2026-06-29',
		meals: [
			{ mealType: 'breakfast', recipeId: 'overnight-oats' },
			{ mealType: 'lunch', recipeId: 'mediterranean-bowl' },
			{ mealType: 'dinner', recipeId: 'teriyaki-salmon-bowl' },
			{ mealType: 'snack', recipeId: 'greek-yogurt-parfait' }
		]
	},
	{
		day: 'Tuesday',
		date: '2026-06-30',
		meals: [
			{ mealType: 'breakfast', recipeId: 'avocado-egg-toast' },
			{ mealType: 'lunch', recipeId: 'turkey-lettuce-wraps' },
			{ mealType: 'dinner', recipeId: 'thai-green-curry' },
			{ mealType: 'snack', recipeId: 'energy-bites' }
		]
	},
	{
		day: 'Wednesday',
		date: '2026-07-01',
		meals: [
			{ mealType: 'breakfast', recipeId: 'greek-yogurt-parfait' },
			{ mealType: 'lunch', recipeId: 'lentil-soup' },
			{ mealType: 'dinner', recipeId: 'veggie-stir-fry' },
			{ mealType: 'snack', recipeId: 'energy-bites' }
		]
	},
	{
		day: 'Thursday',
		date: '2026-07-02',
		meals: [
			{ mealType: 'breakfast', recipeId: 'overnight-oats' },
			{ mealType: 'lunch', recipeId: 'mediterranean-bowl' },
			{ mealType: 'dinner', recipeId: 'thai-green-curry' },
			{ mealType: 'snack', recipeId: 'greek-yogurt-parfait' }
		]
	},
	{
		day: 'Friday',
		date: '2026-07-03',
		meals: [
			{ mealType: 'breakfast', recipeId: 'avocado-egg-toast' },
			{ mealType: 'lunch', recipeId: 'turkey-lettuce-wraps' },
			{ mealType: 'dinner', recipeId: 'teriyaki-salmon-bowl' },
			{ mealType: 'snack', recipeId: 'energy-bites' }
		]
	},
	{
		day: 'Saturday',
		date: '2026-07-04',
		meals: [
			{ mealType: 'breakfast', recipeId: 'greek-yogurt-parfait' },
			{ mealType: 'lunch', recipeId: 'lentil-soup' },
			{ mealType: 'dinner', recipeId: 'veggie-stir-fry' },
			{ mealType: 'snack', recipeId: 'energy-bites' }
		]
	},
	{
		day: 'Sunday',
		date: '2026-07-05',
		meals: [
			{ mealType: 'breakfast', recipeId: 'overnight-oats' },
			{ mealType: 'lunch', recipeId: 'mediterranean-bowl' },
			{ mealType: 'dinner', recipeId: 'thai-green-curry' },
			{ mealType: 'snack', recipeId: 'greek-yogurt-parfait' }
		]
	}
];

/** Index of "today" within the week for the dashboard. */
export const todayIndex = 0;
