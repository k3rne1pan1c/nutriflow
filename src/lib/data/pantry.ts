import type { PantryItem } from '$lib/types';

/** Ingredients the user always keeps on hand. These drop off the shopping list. */
export const defaultPantry: PantryItem[] = [
	{ ingredientId: 'rice', amount: 2000, unit: 'g' },
	{ ingredientId: 'salt', amount: 500, unit: 'g' },
	{ ingredientId: 'pepper', amount: 100, unit: 'g' },
	{ ingredientId: 'soy-sauce', amount: 500, unit: 'ml' },
	{ ingredientId: 'olive-oil', amount: 750, unit: 'ml' },
	{ ingredientId: 'oats', amount: 1000, unit: 'g' },
	{ ingredientId: 'eggs', amount: 12, unit: 'pcs' },
	{ ingredientId: 'honey', amount: 250, unit: 'g' },
	{ ingredientId: 'garlic', amount: 20, unit: 'clove' }
];
