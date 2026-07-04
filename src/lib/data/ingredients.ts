// SEED SOURCE ONLY — do not import at runtime. Used by scripts/seed-catalog.ts.
import type { Ingredient } from '$lib/types';

export const ingredients: Ingredient[] = [
	// Vegetables
	{ id: 'spinach', name: 'Spinach', category: 'Vegetables', unit: 'g', emoji: '🥬' },
	{ id: 'broccoli', name: 'Broccoli', category: 'Vegetables', unit: 'g', emoji: '🥦' },
	{ id: 'carrot', name: 'Carrot', category: 'Vegetables', unit: 'g', emoji: '🥕' },
	{ id: 'bell-pepper', name: 'Bell Pepper', category: 'Vegetables', unit: 'pcs', emoji: '🫑' },
	{ id: 'tomato', name: 'Tomato', category: 'Vegetables', unit: 'pcs', emoji: '🍅' },
	{ id: 'onion', name: 'Onion', category: 'Vegetables', unit: 'pcs', emoji: '🧅' },
	{ id: 'garlic', name: 'Garlic', category: 'Vegetables', unit: 'clove', emoji: '🧄' },
	{ id: 'zucchini', name: 'Zucchini', category: 'Vegetables', unit: 'pcs', emoji: '🥒' },
	{ id: 'sweet-potato', name: 'Sweet Potato', category: 'Vegetables', unit: 'g', emoji: '🍠' },
	{ id: 'kale', name: 'Kale', category: 'Vegetables', unit: 'g', emoji: '🥬' },
	{ id: 'mushroom', name: 'Mushrooms', category: 'Vegetables', unit: 'g', emoji: '🍄' },
	{ id: 'cucumber', name: 'Cucumber', category: 'Vegetables', unit: 'pcs', emoji: '🥒' },
	{ id: 'avocado', name: 'Avocado', category: 'Vegetables', unit: 'pcs', emoji: '🥑' },
	{ id: 'cauliflower', name: 'Cauliflower', category: 'Vegetables', unit: 'g', emoji: '🥦' },
	{ id: 'ginger', name: 'Ginger', category: 'Vegetables', unit: 'g', emoji: '🫚' },

	// Protein
	{ id: 'chicken-breast', name: 'Chicken Breast', category: 'Protein', unit: 'g', emoji: '🍗' },
	{ id: 'salmon', name: 'Salmon Fillet', category: 'Protein', unit: 'g', emoji: '🐟' },
	{ id: 'eggs', name: 'Eggs', category: 'Protein', unit: 'pcs', emoji: '🥚' },
	{ id: 'tofu', name: 'Tofu', category: 'Protein', unit: 'g', emoji: '🧈' },
	{ id: 'ground-beef', name: 'Ground Beef', category: 'Protein', unit: 'g', emoji: '🥩' },
	{ id: 'chickpeas', name: 'Chickpeas', category: 'Protein', unit: 'g', emoji: '🫘' },
	{ id: 'lentils', name: 'Lentils', category: 'Protein', unit: 'g', emoji: '🫘' },
	{ id: 'shrimp', name: 'Shrimp', category: 'Protein', unit: 'g', emoji: '🦐' },
	{ id: 'turkey', name: 'Ground Turkey', category: 'Protein', unit: 'g', emoji: '🦃' },
	{ id: 'black-beans', name: 'Black Beans', category: 'Protein', unit: 'g', emoji: '🫘' },
	{ id: 'greek-yogurt', name: 'Greek Yogurt', category: 'Protein', unit: 'g', emoji: '🥛' },

	// Fruit
	{ id: 'banana', name: 'Banana', category: 'Fruit', unit: 'pcs', emoji: '🍌' },
	{ id: 'blueberries', name: 'Blueberries', category: 'Fruit', unit: 'g', emoji: '🫐' },
	{ id: 'apple', name: 'Apple', category: 'Fruit', unit: 'pcs', emoji: '🍎' },
	{ id: 'lemon', name: 'Lemon', category: 'Fruit', unit: 'pcs', emoji: '🍋' },
	{ id: 'lime', name: 'Lime', category: 'Fruit', unit: 'pcs', emoji: '🍋' },
	{ id: 'strawberries', name: 'Strawberries', category: 'Fruit', unit: 'g', emoji: '🍓' },
	{ id: 'orange', name: 'Orange', category: 'Fruit', unit: 'pcs', emoji: '🍊' },

	// Spices
	{ id: 'salt', name: 'Salt', category: 'Spices', unit: 'g', emoji: '🧂' },
	{ id: 'pepper', name: 'Black Pepper', category: 'Spices', unit: 'g', emoji: '🌶️' },
	{ id: 'paprika', name: 'Paprika', category: 'Spices', unit: 'g', emoji: '🌶️' },
	{ id: 'cumin', name: 'Cumin', category: 'Spices', unit: 'g', emoji: '🟤' },
	{ id: 'turmeric', name: 'Turmeric', category: 'Spices', unit: 'g', emoji: '🟡' },
	{ id: 'cinnamon', name: 'Cinnamon', category: 'Spices', unit: 'g', emoji: '🟤' },
	{ id: 'chili-flakes', name: 'Chili Flakes', category: 'Spices', unit: 'g', emoji: '🌶️' },
	{ id: 'soy-sauce', name: 'Soy Sauce', category: 'Spices', unit: 'ml', emoji: '🍶' },

	// Grains
	{ id: 'rice', name: 'Rice', category: 'Grains', unit: 'g', emoji: '🍚' },
	{ id: 'oats', name: 'Oats', category: 'Grains', unit: 'g', emoji: '🌾' },
	{ id: 'quinoa', name: 'Quinoa', category: 'Grains', unit: 'g', emoji: '🌾' },
	{ id: 'pasta', name: 'Pasta', category: 'Grains', unit: 'g', emoji: '🍝' },
	{ id: 'bread', name: 'Whole Grain Bread', category: 'Grains', unit: 'pcs', emoji: '🍞' },
	{ id: 'tortilla', name: 'Tortilla', category: 'Grains', unit: 'pcs', emoji: '🫓' },

	// Dairy
	{ id: 'milk', name: 'Milk', category: 'Dairy', unit: 'ml', emoji: '🥛' },
	{ id: 'cheese', name: 'Cheese', category: 'Dairy', unit: 'g', emoji: '🧀' },
	{ id: 'butter', name: 'Butter', category: 'Dairy', unit: 'g', emoji: '🧈' },

	// Other
	{ id: 'olive-oil', name: 'Olive Oil', category: 'Other', unit: 'ml', emoji: '🫒' },
	{ id: 'honey', name: 'Honey', category: 'Other', unit: 'g', emoji: '🍯' },
	{ id: 'almonds', name: 'Almonds', category: 'Other', unit: 'g', emoji: '🌰' },
	{ id: 'peanut-butter', name: 'Peanut Butter', category: 'Other', unit: 'g', emoji: '🥜' },
	{ id: 'coconut-milk', name: 'Coconut Milk', category: 'Other', unit: 'ml', emoji: '🥥' },
	{ id: 'chia-seeds', name: 'Chia Seeds', category: 'Other', unit: 'g', emoji: '⚫' },
	{ id: 'curry-paste', name: 'Curry Paste', category: 'Other', unit: 'g', emoji: '🍛' }
];

export const ingredientMap: Record<string, Ingredient> = Object.fromEntries(
	ingredients.map((i) => [i.id, i])
);

export function getIngredient(id: string): Ingredient | undefined {
	return ingredientMap[id];
}
