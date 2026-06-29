export type IngredientCategory =
	| 'Vegetables'
	| 'Protein'
	| 'Fruit'
	| 'Spices'
	| 'Grains'
	| 'Dairy'
	| 'Other';

export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'pcs' | 'tbsp' | 'tsp' | 'cup' | 'clove' | 'bunch';

/** How the user prices an ingredient locally (per kg, liter, or piece). */
export type PriceUnit = 'kg' | 'l' | 'pcs';

export interface Ingredient {
	id: string;
	name: string;
	category: IngredientCategory;
	unit: Unit;
	emoji?: string;
}

export interface UserIngredientPrice {
	ingredientId: string;
	price: number;
	perUnit: PriceUnit;
}

export interface RecipeIngredient {
	ingredientId: string;
	/** Amount required per single serving. */
	amountPerServing: number;
	unit: Unit;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Nutrition {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	fiber: number;
}

export interface Recipe {
	id: string;
	title: string;
	description: string;
	cuisine: string;
	mealType: MealType;
	image: string;
	/** minutes */
	prepTime: number;
	cookTime: number;
	difficulty: Difficulty;
	baseServings: number;
	nutrition: Nutrition;
	tags: string[];
	ingredients: RecipeIngredient[];
	instructions: string[];
	healthBenefits: string[];
	substitutions: { from: string; to: string }[];
	mealPrepTips: string[];
	favorite?: boolean;
}

export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Athlete';
export type Sex = 'Male' | 'Female' | 'Other';
export type CookingExperience = 'Beginner' | 'Intermediate' | 'Advanced';

export interface HouseholdMember {
	id: string;
	name: string;
	relation: string;
	age: number;
	sex: Sex;
	height: number;
	weight: number;
	activity: ActivityLevel;
	goals: string[];
	diet: string;
	allergies: string[];
	avoid: string[];
	eatsEveryMeal: boolean;
	enabled: boolean;
	isPrimary?: boolean;
	avatarColor: string;
}

export interface UserProfile {
	name: string;
	age: number | null;
	sex: Sex | null;
	height: number | null;
	weight: number | null;
	targetWeight: number | null;
	activity: ActivityLevel | null;
	goals: string[];
	diet: string | null;
	allergies: string[];
	avoid: string;
	cuisines: string[];
	experience: CookingExperience | null;
	equipment: string[];
	maxCookingTime: number;
	weeklyBudget: number;
	country: string;
	region: string;
	city: string;
	pantry: string[];
}

export interface PlannedMeal {
	mealType: MealType;
	recipeId: string;
}

export interface PlannedDay {
	day: string;
	date: string;
	meals: PlannedMeal[];
}

export interface ShoppingItem {
	id: string;
	ingredientId: string;
	name: string;
	category: IngredientCategory;
	amount: number;
	unit: Unit;
	inPantry: boolean;
	checked: boolean;
}

export interface PantryItem {
	ingredientId: string;
	amount: number;
	unit: Unit;
}

export interface DailyNutrition {
	day: string;
	score: number;
	calories: number;
	calorieTarget: number;
}
