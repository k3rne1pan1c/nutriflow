import type { HouseholdMember, MealType, PantryItem, PlannedDay, UserIngredientPrice, UserProfile } from '$lib/types';
import { householdMembers } from '$lib/data/household';
import { defaultPantry } from '$lib/data/pantry';
import { recipes } from '$lib/data/recipes';
import { mealPlan } from '$lib/data/mealPlan';

function createEmptyProfile(): UserProfile {
	return {
		name: '',
		age: null,
		sex: null,
		height: null,
		weight: null,
		targetWeight: null,
		activity: null,
		goals: [],
		diet: null,
		allergies: [],
		avoid: '',
		cuisines: [],
		experience: null,
		equipment: [],
		maxCookingTime: 30,
		weeklyBudget: 120,
		country: '',
		region: '',
		city: '',
		pantry: []
	};
}

class AppState {
	profile = $state<UserProfile>(createEmptyProfile());
	household = $state<HouseholdMember[]>(householdMembers.map((m) => ({ ...m })));
	pantry = $state<PantryItem[]>(defaultPantry.map((p) => ({ ...p })));
	favorites = $state<string[]>(recipes.filter((r) => r.favorite).map((r) => r.id));
	hydrationGlasses = $state(5);
	notifications = $state({ mealReminders: true, shoppingReminders: true, hydration: false });
	onboarded = $state(false);
	plan = $state<PlannedDay[]>(structuredClone(mealPlan));
	checkedShopping = $state<string[]>([]);
	ingredientPrices = $state<UserIngredientPrice[]>([]);

	get activeMembers() {
		return this.household.filter((m) => m.enabled);
	}

	get pantryIds() {
		return this.pantry.map((p) => p.ingredientId);
	}

	get activePeopleLabel() {
		const adults = this.activeMembers.filter((m) => m.age >= 18).length;
		const kids = this.activeMembers.filter((m) => m.age < 18).length;
		const parts: string[] = [];
		if (adults) parts.push(`${adults} adult${adults > 1 ? 's' : ''}`);
		if (kids) parts.push(`${kids} child${kids > 1 ? 'ren' : ''}`);
		return parts.join(' + ') || 'No one selected';
	}

	toggleFavorite(id: string) {
		if (this.favorites.includes(id)) {
			this.favorites = this.favorites.filter((f) => f !== id);
		} else {
			this.favorites = [...this.favorites, id];
		}
	}

	isFavorite(id: string) {
		return this.favorites.includes(id);
	}

	toggleMember(id: string) {
		const member = this.household.find((m) => m.id === id);
		if (member) member.enabled = !member.enabled;
	}

	addMember(member: HouseholdMember) {
		this.household = [...this.household, member];
	}

	removeMember(id: string) {
		this.household = this.household.filter((m) => m.id !== id || m.isPrimary);
	}

	addPantryItem(item: PantryItem) {
		if (!this.pantry.some((p) => p.ingredientId === item.ingredientId)) {
			this.pantry = [...this.pantry, item];
		}
	}

	removePantryItem(ingredientId: string) {
		this.pantry = this.pantry.filter((p) => p.ingredientId !== ingredientId);
	}

	updatePantryAmount(ingredientId: string, amount: number) {
		const item = this.pantry.find((p) => p.ingredientId === ingredientId);
		if (item) item.amount = Math.max(0, amount);
	}

	/** Swap a meal for another recipe of the same meal type. */
	replaceMeal(dayIndex: number, mealType: MealType) {
		const day = this.plan[dayIndex];
		const meal = day?.meals.find((m) => m.mealType === mealType);
		if (!meal) return;
		const options = recipes.filter((r) => r.mealType === mealType && r.id !== meal.recipeId);
		if (options.length === 0) return;
		meal.recipeId = options[Math.floor(Math.random() * options.length)].id;
	}

	toggleShopping(id: string) {
		this.checkedShopping = this.checkedShopping.includes(id)
			? this.checkedShopping.filter((x) => x !== id)
			: [...this.checkedShopping, id];
	}

	isShoppingChecked(id: string) {
		return this.checkedShopping.includes(id);
	}

	getIngredientPrice(ingredientId: string): UserIngredientPrice | undefined {
		return this.ingredientPrices.find((p) => p.ingredientId === ingredientId);
	}

	setIngredientPrice(ingredientId: string, price: number, perUnit: UserIngredientPrice['perUnit']) {
		const existing = this.ingredientPrices.find((p) => p.ingredientId === ingredientId);
		if (existing) {
			existing.price = price;
			existing.perUnit = perUnit;
		} else {
			this.ingredientPrices = [...this.ingredientPrices, { ingredientId, price, perUnit }];
		}
	}

	removeIngredientPrice(ingredientId: string) {
		this.ingredientPrices = this.ingredientPrices.filter((p) => p.ingredientId !== ingredientId);
	}
}

export const app = new AppState();
