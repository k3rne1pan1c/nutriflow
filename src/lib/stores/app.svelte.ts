import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	HouseholdMember,
	Ingredient,
	MealType,
	PantryItem,
	PlannedDay,
	Recipe,
	UserIngredientPrice,
	UserProfile
} from '$lib/types';
import {
	saveFavorites,
	saveHousehold,
	saveIngredientPrices,
	saveMealPlan,
	savePantry,
	saveProfile,
	type CatalogData,
	type UserData
} from '$lib/supabase/userData';
import { activeMembersForWeek, householdServingFactor, mealServingFactor } from '$lib/household';
import { filterRecipes } from '$lib/plan/filterRecipes';
import { getWeekStart } from '$lib/nutrition';
import { rankRecipesForMealType } from '$lib/plan/scoreRecipes';
import { extractGeneratedRecipesFromPlan, mergeRecipeLists } from '$lib/plan/generatedRecipes';

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
	household = $state<HouseholdMember[]>([]);
	pantry = $state<PantryItem[]>([]);
	favorites = $state<string[]>([]);
	hydrationGlasses = $state(5);
	notifications = $state({ mealReminders: true, shoppingReminders: true, hydration: false });
	onboarded = $state(false);
	plan = $state<PlannedDay[]>([]);
	checkedShopping = $state<string[]>([]);
	ingredientPrices = $state<UserIngredientPrice[]>([]);
	planId = $state<string | null>(null);

	ingredients = $state<Ingredient[]>([]);
	recipes = $state<Recipe[]>([]);

	supabase: SupabaseClient | null = null;
	userId: string | null = null;
	loaded = $state(false);
	syncing = $state(false);

	private syncTimer: ReturnType<typeof setTimeout> | null = null;

	get ingredientMap(): Record<string, Ingredient> {
		return Object.fromEntries(this.ingredients.map((i) => [i.id, i]));
	}

	get recipeMap(): Record<string, Recipe> {
		return Object.fromEntries(this.recipes.map((r) => [r.id, r]));
	}

	get weekStart() {
		return getWeekStart(this.plan);
	}

	get activeMembers() {
		return activeMembersForWeek(this.household, this.weekStart);
	}

	get householdScale() {
		return householdServingFactor(this.activeMembers);
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

	get isPersisted() {
		return Boolean(this.supabase && this.userId);
	}

	get catalogReady() {
		return this.ingredients.length > 0 && this.recipes.length > 0;
	}

	getIngredient(id: string): Ingredient | undefined {
		return this.ingredientMap[id];
	}

	getRecipe(id: string): Recipe | undefined {
		const fromList = this.recipeMap[id];
		if (fromList) return fromList;
		for (const day of this.plan) {
			for (const meal of day.meals) {
				if (meal.recipe?.id === id) return meal.recipe;
			}
		}
		return undefined;
	}

	mergeGeneratedRecipes(recipes: Recipe[]) {
		if (recipes.length === 0) return;
		this.recipes = mergeRecipeLists(this.recipes, recipes);
	}

	private mergeRecipesFromPlan(plan: PlannedDay[]) {
		this.mergeGeneratedRecipes(extractGeneratedRecipesFromPlan(plan));
	}

	hydrate(
		supabase: SupabaseClient,
		userId: string,
		catalog: CatalogData,
		userData?: UserData
	) {
		const isNewSession = this.userId !== userId;
		this.supabase = supabase;
		this.userId = userId;
		this.ingredients = catalog.ingredients;
		this.recipes = mergeRecipeLists(catalog.recipes, userData?.userRecipes ?? []);
		if (userData && (!this.loaded || isNewSession)) {
			this.applyUserData(userData);
		}
		this.loaded = true;
	}

	applyUserData(data: UserData) {
		const merged = { ...createEmptyProfile(), ...data.profile };
		Object.assign(this.profile, merged);
		this.profile.goals = [...merged.goals];
		this.profile.allergies = [...merged.allergies];
		this.profile.cuisines = [...merged.cuisines];
		this.profile.equipment = [...merged.equipment];
		this.profile.pantry = [...merged.pantry];
		this.household = data.household;
		this.pantry = data.pantry;
		this.favorites = data.favorites;
		this.plan = data.plan;
		this.mergeRecipesFromPlan(data.plan);
		this.checkedShopping = data.checkedShopping;
		this.ingredientPrices = data.ingredientPrices;
		this.hydrationGlasses = data.hydrationGlasses;
		this.notifications = data.notifications;
		this.onboarded = data.onboarded;
		this.planId = data.planId;
	}

	scheduleSync(fn: () => Promise<void>) {
		if (!this.isPersisted) return;
		if (this.syncTimer) clearTimeout(this.syncTimer);
		this.syncTimer = setTimeout(async () => {
			this.syncing = true;
			try {
				await fn();
			} catch (e) {
				console.error('Sync failed:', e);
			} finally {
				this.syncing = false;
			}
		}, 500);
	}

	syncProfile() {
		this.scheduleSync(async () => {
			await saveProfile(this.supabase!, this.userId!, {
				profile: this.profile,
				onboarded: this.onboarded,
				hydrationGlasses: this.hydrationGlasses,
				notifications: this.notifications
			});
		});
	}

	syncHousehold() {
		this.scheduleSync(() => saveHousehold(this.supabase!, this.userId!, this.household));
	}

	syncPantry() {
		this.scheduleSync(() => savePantry(this.supabase!, this.userId!, this.pantry));
	}

	syncFavorites() {
		this.scheduleSync(() => saveFavorites(this.supabase!, this.userId!, this.favorites));
	}

	syncPrices() {
		this.scheduleSync(() =>
			saveIngredientPrices(this.supabase!, this.userId!, this.ingredientPrices)
		);
	}

	syncPlan() {
		this.scheduleSync(async () => {
			const id = await saveMealPlan(
				this.supabase!,
				this.userId!,
				this.plan,
				this.checkedShopping,
				this.planId
			);
			this.planId = id;
		});
	}

	async completeOnboarding(pantryItems: PantryItem[], household: HouseholdMember[]) {
		this.pantry = pantryItems;
		this.household = household;
		this.onboarded = true;
		await this.persistUserState();
	}

	/** Save profile + household + pantry (edit mode or onboarding). */
	async persistUserState() {
		if (!this.isPersisted) {
			throw new Error('Could not save — not connected. Please wait a moment and try again.');
		}
		await saveProfile(this.supabase!, this.userId!, {
			profile: this.profile,
			onboarded: this.onboarded,
			hydrationGlasses: this.hydrationGlasses,
			notifications: this.notifications
		});
		await saveHousehold(this.supabase!, this.userId!, this.household);
		await savePantry(this.supabase!, this.userId!, this.pantry);
	}

	async savePreferences(pantryItems?: PantryItem[], household?: HouseholdMember[]) {
		if (pantryItems) this.pantry = pantryItems;
		if (household) {
			if (household.length === 1 && household[0].isPrimary) {
				const existing = this.household.filter((m) => !m.isPrimary);
				this.household = [{ ...household[0], disabledForWeek: household[0].disabledForWeek ?? null }, ...existing];
			} else {
				this.household = household;
			}
			this.syncPrimaryFromProfile();
		}
		await this.persistUserState();
	}

	/** Save one preference section without touching unrelated data. */
	async saveProfileEdit(options?: { pantryItems?: PantryItem[]; updatePrimary?: boolean }) {
		if (options?.pantryItems) this.pantry = options.pantryItems;
		if (options?.updatePrimary) this.syncPrimaryFromProfile();
		await this.persistUserState();
	}

	setPlan(plan: PlannedDay[], planId?: string, options?: { skipSync?: boolean; recipes?: Recipe[] }) {
		this.plan = structuredClone(plan).map((day) => ({
			...day,
			meals: day.meals.map((m) => ({ ...m, review: undefined }))
		}));
		this.checkedShopping = [];
		if (planId) this.planId = planId;
		if (options?.recipes?.length) this.mergeGeneratedRecipes(options.recipes);
		else this.mergeRecipesFromPlan(this.plan);
		if (!options?.skipSync) this.syncPlan();
	}

	toggleFavorite(id: string) {
		if (this.favorites.includes(id)) {
			this.favorites = this.favorites.filter((f) => f !== id);
		} else {
			this.favorites = [...this.favorites, id];
		}
		this.syncFavorites();
	}

	isFavorite(id: string) {
		return this.favorites.includes(id);
	}

	toggleMemberForWeek(id: string) {
		const member = this.household.find((m) => m.id === id);
		if (!member || !this.weekStart) return;
		const active = this.activeMembers;
		if (member.isPrimary && active.length <= 1 && active[0]?.id === id) return;
		member.disabledForWeek =
			member.disabledForWeek === this.weekStart ? null : this.weekStart;
		this.syncHousehold();
	}

	isMemberActiveThisWeek(member: HouseholdMember): boolean {
		return activeMembersForWeek([member], this.weekStart).length > 0;
	}

	updateMember(id: string, updates: Partial<HouseholdMember>) {
		const idx = this.household.findIndex((m) => m.id === id);
		if (idx < 0) return;
		this.household[idx] = { ...this.household[idx], ...updates };
		this.household = [...this.household];
		this.syncHousehold();
	}

	syncPrimaryFromProfile() {
		const primary = this.household.find((m) => m.isPrimary);
		if (!primary) return;
		Object.assign(primary, {
			name: this.profile.name || primary.name,
			age: this.profile.age ?? primary.age,
			sex: this.profile.sex ?? primary.sex,
			height: this.profile.height ?? primary.height,
			weight: this.profile.weight ?? primary.weight,
			activity: this.profile.activity ?? primary.activity,
			goals: [...this.profile.goals],
			diet: this.profile.diet ?? primary.diet,
			allergies: [...this.profile.allergies],
			avoid: this.profile.avoid
				? this.profile.avoid.split(',').map((s) => s.trim()).filter(Boolean)
				: primary.avoid
		});
		this.household = [...this.household];
		this.syncHousehold();
	}

	/** @deprecated Use toggleMemberForWeek */
	toggleMember(id: string) {
		this.toggleMemberForWeek(id);
	}

	addMember(member: HouseholdMember) {
		this.household = [
			...this.household,
			{ ...member, disabledForWeek: member.disabledForWeek ?? null }
		];
		this.syncHousehold();
	}

	removeMember(id: string) {
		this.household = this.household.filter((m) => m.id !== id || m.isPrimary);
		this.syncHousehold();
	}

	addPantryItem(item: PantryItem) {
		if (!this.pantry.some((p) => p.ingredientId === item.ingredientId)) {
			this.pantry = [...this.pantry, item];
			this.syncPantry();
		}
	}

	removePantryItem(ingredientId: string) {
		this.pantry = this.pantry.filter((p) => p.ingredientId !== ingredientId);
		this.syncPantry();
	}

	updatePantryAmount(ingredientId: string, amount: number) {
		const item = this.pantry.find((p) => p.ingredientId === ingredientId);
		if (item) {
			item.amount = Math.max(0, amount);
			this.syncPantry();
		}
	}

	replaceMeal(dayIndex: number, mealType: MealType, recipeId?: string, reason?: string, recipe?: Recipe) {
		const day = this.plan[dayIndex];
		const meal = day?.meals.find((m) => m.mealType === mealType);
		if (!meal) return;

		let replacement: Recipe | undefined = recipe;
		if (!replacement && recipeId) {
			replacement = this.getRecipe(recipeId);
			if (!replacement || replacement.mealType !== mealType) return;
		} else if (!replacement) {
			const options = this.getReplacementOptions(dayIndex, mealType);
			replacement = options[0];
		}
		if (!replacement) return;

		if (replacement.id.startsWith('ai-')) {
			this.mergeGeneratedRecipes([replacement]);
		}

		meal.recipeId = replacement.id;
		meal.reason = reason ?? meal.reason;
		meal.recipe = replacement.id.startsWith('ai-') ? replacement : undefined;
		meal.review = undefined;
		this.syncPlan();
	}

	async generateMealReplacement(dayIndex: number, mealType: MealType) {
		const res = await fetch('/api/generate-meal-replacement', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ dayIndex, mealType, plan: this.plan })
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) {
			throw new Error(body.message ?? 'Could not generate a replacement meal');
		}
		return {
			recipeId: body.recipeId as string,
			reason: body.reason as string,
			source: body.source as string,
			recipe: body.recipe as Recipe | undefined,
			debug: body.debug as Record<string, unknown> | undefined
		};
	}

	getReplacementOptions(dayIndex: number, mealType: MealType): Recipe[] {
		const meal = this.plan[dayIndex]?.meals.find((m) => m.mealType === mealType);
		if (!meal) return [];

		const ctx = {
			profile: this.profile,
			household: this.household,
			pantryIds: this.pantryIds,
			weekStart: this.weekStart,
			ingredientMap: this.ingredientMap
		};
		const eligible = filterRecipes(this.recipes, ctx);
		const selectedRecipes = this.plan
			.flatMap((d) => d.meals.map((m) => this.getRecipe(m.recipeId)))
			.filter((r): r is Recipe => Boolean(r));
		const scoreCtx = {
			profile: this.profile,
			pantryIds: this.pantryIds,
			selectedIds: selectedRecipes.map((r) => r.id)
		};

		return rankRecipesForMealType(eligible, mealType, scoreCtx, selectedRecipes, 15).filter(
			(r) => r.id !== meal.recipeId
		);
	}

	setMealReview(dayIndex: number, mealType: MealType, review: 'liked' | 'disliked' | null) {
		const meal = this.plan[dayIndex]?.meals.find((m) => m.mealType === mealType);
		if (!meal) return;
		meal.review = review ?? undefined;
		this.syncPlan();
	}

	scaledIngredients(recipe: Recipe, mealType?: MealType) {
		const factor = mealType
			? mealServingFactor(this.activeMembers, mealType)
			: this.householdScale;
		const scale = factor / Math.max(recipe.baseServings, 1);
		return recipe.ingredients.map((ing) => ({
			...ing,
			amountPerServing: Math.round(ing.amountPerServing * scale * 10) / 10
		}));
	}

	toggleShopping(id: string) {
		this.checkedShopping = this.checkedShopping.includes(id)
			? this.checkedShopping.filter((x) => x !== id)
			: [...this.checkedShopping, id];
		this.syncPlan();
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
		this.syncPrices();
	}

	removeIngredientPrice(ingredientId: string) {
		this.ingredientPrices = this.ingredientPrices.filter((p) => p.ingredientId !== ingredientId);
		this.syncPrices();
	}

	setHydrationGlasses(n: number) {
		this.hydrationGlasses = Math.max(0, n);
		this.syncProfile();
	}
}

export const app = new AppState();
