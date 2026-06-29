import type { HouseholdMember, IngredientCategory, ShoppingItem, Unit } from '$lib/types';
import { mealPlan } from './mealPlan';
import { recipeMap } from './recipes';
import { ingredientMap } from './ingredients';
import { servingFactor } from './household';

export const categoryOrder: IngredientCategory[] = [
	'Vegetables',
	'Protein',
	'Fruit',
	'Grains',
	'Dairy',
	'Spices',
	'Other'
];

/**
 * Aggregate every ingredient required across the week, scaled by the number of
 * active household members (children count as a fraction of an adult portion),
 * then flag anything already in the pantry. This mirrors the intent of the
 * future AI generator while staying fully deterministic for the prototype.
 */
export function buildShoppingList(
	activeMembers: HouseholdMember[],
	pantryIds: string[]
): ShoppingItem[] {
	const totalFactor = activeMembers.reduce((sum, m) => sum + servingFactor(m), 0) || 1;
	const totals = new Map<string, { amount: number; unit: Unit }>();

	for (const day of mealPlan) {
		for (const meal of day.meals) {
			const recipe = recipeMap[meal.recipeId];
			if (!recipe) continue;
			for (const ing of recipe.ingredients) {
				const required = ing.amountPerServing * totalFactor;
				const existing = totals.get(ing.ingredientId);
				if (existing) {
					existing.amount += required;
				} else {
					totals.set(ing.ingredientId, { amount: required, unit: ing.unit });
				}
			}
		}
	}

	const items: ShoppingItem[] = [];
	for (const [ingredientId, { amount, unit }] of totals) {
		const ingredient = ingredientMap[ingredientId];
		if (!ingredient) continue;
		const rounded = unit === 'pcs' || unit === 'clove' ? Math.ceil(amount) : Math.round(amount);
		const inPantry = pantryIds.includes(ingredientId);
		items.push({
			id: `shop-${ingredientId}`,
			ingredientId,
			name: ingredient.name,
			category: ingredient.category,
			amount: rounded,
			unit,
			inPantry,
			checked: false
		});
	}

	return items.sort((a, b) => {
		const ci = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
		return ci !== 0 ? ci : a.name.localeCompare(b.name);
	});
}

export function groupByCategory(items: ShoppingItem[]) {
	const groups = new Map<IngredientCategory, ShoppingItem[]>();
	for (const cat of categoryOrder) groups.set(cat, []);
	for (const item of items) groups.get(item.category)?.push(item);
	return categoryOrder
		.map((category) => ({ category, items: groups.get(category) ?? [] }))
		.filter((g) => g.items.length > 0);
}
