import { Sunrise, Sun, Moon, Cookie, type LucideIcon } from '@lucide/svelte';
import type { MealType, Difficulty } from '$lib/types';

export const mealMeta: Record<MealType, { label: string; emoji: string; icon: LucideIcon }> = {
	breakfast: { label: 'Breakfast', emoji: '🥣', icon: Sunrise },
	lunch: { label: 'Lunch', emoji: '🥗', icon: Sun },
	dinner: { label: 'Dinner', emoji: '🍲', icon: Moon },
	snack: { label: 'Snack', emoji: '🍓', icon: Cookie }
};

export const mealOrder: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const difficultyColor: Record<Difficulty, string> = {
	Easy: 'text-success',
	Medium: 'text-warning',
	Hard: 'text-destructive'
};

export const goalOptions = [
	'Longevity',
	'Anti Aging',
	'Energy',
	'Brain Health',
	'Gut Health',
	'Muscle Gain',
	'Fat Loss',
	'Hormone Balance',
	'Testosterone',
	"Women's Health",
	'Inflammation Reduction',
	'Healthy Skin',
	'Better Sleep'
];

export const dietOptions = [
	'Omnivore',
	'Vegetarian',
	'Vegan',
	'Mediterranean',
	'Keto',
	'Low Carb',
	'Paleo',
	'Traditional Chinese Medicine',
	'Ayurvedic'
];

export const activityOptions = ['Sedentary', 'Light', 'Moderate', 'Active', 'Athlete'] as const;

export const cuisineOptions = [
	'German',
	'Italian',
	'Turkish',
	'Greek',
	'Mediterranean',
	'American',
	'Chinese',
	'Japanese',
	'Korean',
	'Thai',
	'Vietnamese',
	'Indian',
	'Mexican'
] as const;

export const allergyOptions = [
	'Gluten',
	'Dairy',
	'Eggs',
	'Peanuts',
	'Tree Nuts',
	'Soy',
	'Shellfish',
	'Fish',
	'Sesame'
];

export const equipmentOptions = [
	'Rice Cooker',
	'Air Fryer',
	'Oven',
	'Blender',
	'Slow Cooker',
	'Steam Oven',
	'Pressure Cooker',
	'Microwave',
	'Food Processor'
];

export const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'] as const;
