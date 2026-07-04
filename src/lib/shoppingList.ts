import type {
	HouseholdMember,
	Ingredient,
	IngredientCategory,
	PantryItem,
	PlannedDay,
	Recipe,
	ShoppingItem,
	Unit
} from '$lib/types';
import { mealServingFactor } from '$lib/household';

export const categoryOrder: IngredientCategory[] = [
	'Vegetables',
	'Protein',
	'Fruit',
	'Grains',
	'Dairy',
	'Spices',
	'Other'
];

function roundAmount(amount: number, unit: Unit): number {
	return unit === 'pcs' || unit === 'clove' ? Math.ceil(amount) : Math.round(amount);
}

function pantryStockFor(
	pantry: PantryItem[],
	ingredientId: string
): { amount: number; unit: Unit } | null {
	const item = pantry.find((p) => p.ingredientId === ingredientId);
	return item ? { amount: item.amount, unit: item.unit } : null;
}

function subtractPantry(
	required: number,
	unit: Unit,
	stock: { amount: number; unit: Unit } | null
): { amountToBuy: number; fullyCovered: boolean } {
	if (!stock || stock.unit !== unit) {
		return { amountToBuy: required, fullyCovered: false };
	}
	const remaining = Math.max(0, required - stock.amount);
	return {
		amountToBuy: remaining,
		fullyCovered: remaining === 0 && required > 0
	};
}

export function buildShoppingList(
	activeMembers: HouseholdMember[],
	pantry: PantryItem[],
	plan: PlannedDay[],
	recipeMap: Record<string, Recipe>,
	ingredientMap: Record<string, Ingredient>,
	options?: { includeCovered?: boolean }
): ShoppingItem[] {
	const totals = new Map<string, { amount: number; unit: Unit }>();

	for (const day of plan) {
		for (const meal of day.meals) {
			const recipe = recipeMap[meal.recipeId];
			if (!recipe) continue;
			const factor = mealServingFactor(activeMembers, meal.mealType);
			const scale = factor / Math.max(recipe.baseServings, 1);
			for (const ing of recipe.ingredients) {
				const required = ing.amountPerServing * scale;
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
		const rounded = roundAmount(amount, unit);
		const stock = pantryStockFor(pantry, ingredientId);
		const { amountToBuy, fullyCovered } = subtractPantry(rounded, unit, stock);
		const inPantry = Boolean(stock);
		if (fullyCovered && !options?.includeCovered) continue;
		items.push({
			id: `shop-${ingredientId}`,
			ingredientId,
			name: ingredient.name,
			category: ingredient.category,
			amount: rounded,
			unit,
			amountToBuy: roundAmount(amountToBuy, unit),
			inPantry,
			fullyCoveredByPantry: fullyCovered,
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

/** Items the user still needs to purchase. */
export function itemsToBuy(items: ShoppingItem[]): ShoppingItem[] {
	return items.filter((i) => i.amountToBuy > 0);
}
