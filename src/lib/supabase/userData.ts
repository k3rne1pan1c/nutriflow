import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	HouseholdMember,
	Ingredient,
	PantryItem,
	PlannedDay,
	Recipe,
	UserIngredientPrice,
	UserProfile
} from '$lib/types';
import { buildWeekSkeleton } from '$lib/plan/mockPlan';

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

export interface CatalogData {
	ingredients: Ingredient[];
	recipes: Recipe[];
}

export interface UserData {
	profile: UserProfile;
	household: HouseholdMember[];
	pantry: PantryItem[];
	favorites: string[];
	plan: PlannedDay[];
	checkedShopping: string[];
	ingredientPrices: UserIngredientPrice[];
	hydrationGlasses: number;
	notifications: { mealReminders: boolean; shoppingReminders: boolean; hydration: boolean };
	onboarded: boolean;
	planId: string | null;
	/** AI-generated and admin-assigned recipes for this user */
	userRecipes: Recipe[];
}

export function defaultUserData(): UserData {
	return {
		profile: createEmptyProfile(),
		household: [],
		pantry: [],
		favorites: [],
		plan: buildWeekSkeleton(),
		checkedShopping: [],
		ingredientPrices: [],
		hydrationGlasses: 5,
		notifications: { mealReminders: true, shoppingReminders: true, hydration: false },
		onboarded: false,
		planId: null,
		userRecipes: []
	};
}

export async function loadCatalog(supabase: SupabaseClient): Promise<CatalogData> {
	const [ingredientsRes, recipesRes] = await Promise.all([
		supabase.from('ingredients').select('*').order('name'),
		supabase.from('recipes').select('id, data')
	]);

	if (ingredientsRes.error) throw ingredientsRes.error;
	if (recipesRes.error) throw recipesRes.error;

	const ingredients: Ingredient[] =
		ingredientsRes.data?.map((row) => ({
			id: row.id,
			name: row.name,
			category: row.category as Ingredient['category'],
			unit: row.unit as Ingredient['unit'],
			emoji: row.emoji ?? undefined
		})) ?? [];

	const recipes: Recipe[] =
		recipesRes.data?.map((row) => row.data as Recipe) ?? [];

	return { ingredients, recipes };
}

export async function loadUserData(supabase: SupabaseClient, userId: string): Promise<UserData> {
	const defaults = defaultUserData();

	const [
		profileRes,
		householdRes,
		pantryRes,
		planRes,
		pricesRes,
		favoritesRes
	] = await Promise.all([
		supabase.from('profiles').select('*').eq('id', userId).single(),
		supabase.from('household_members').select('id, data').eq('user_id', userId),
		supabase.from('pantry_items').select('*').eq('user_id', userId),
		supabase
			.from('meal_plans')
			.select('*')
			.eq('user_id', userId)
			.eq('is_active', true)
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle(),
		supabase.from('user_ingredient_prices').select('*').eq('user_id', userId),
		supabase.from('favorites').select('recipe_id').eq('user_id', userId)
	]);

	const row = profileRes.data;
	const profileData = (row?.profile_data ?? {}) as Partial<UserProfile>;
	const profile: UserProfile = { ...defaults.profile, ...profileData };

	const household: HouseholdMember[] =
		householdRes.data && householdRes.data.length > 0
			? householdRes.data.map((r) => ({
					...(r.data as HouseholdMember),
					disabledForWeek: (r.data as HouseholdMember).disabledForWeek ?? null
				}))
			: [];

	const pantry: PantryItem[] =
		pantryRes.data && pantryRes.data.length > 0
			? pantryRes.data.map((p) => ({
					ingredientId: p.ingredient_id,
					amount: Number(p.amount),
					unit: p.unit as PantryItem['unit']
				}))
			: [];

	const activePlan = planRes.data;
	const plan: PlannedDay[] = activePlan?.days
		? (activePlan.days as PlannedDay[])
		: buildWeekSkeleton();
	const checkedShopping: string[] = activePlan?.checked_shopping
		? (activePlan.checked_shopping as string[])
		: [];

	const ingredientPrices: UserIngredientPrice[] =
		pricesRes.data?.map((p) => ({
			ingredientId: p.ingredient_id,
			price: Number(p.price),
			perUnit: p.per_unit as UserIngredientPrice['perUnit']
		})) ?? [];

	const favorites = favoritesRes.data?.map((f) => f.recipe_id) ?? [];

	const { data: userRecipeLinks } = await supabase
		.from('user_recipes')
		.select('recipe_id')
		.eq('user_id', userId);

	const userRecipeIds = userRecipeLinks?.map((r) => r.recipe_id) ?? [];
	let userRecipes: Recipe[] = [];
	if (userRecipeIds.length > 0) {
		const { data: userRecipeRows } = await supabase
			.from('recipes')
			.select('id, data')
			.in('id', userRecipeIds);
		userRecipes = userRecipeRows?.map((r) => r.data as Recipe) ?? [];
	}

	return {
		profile,
		household,
		pantry,
		favorites,
		plan,
		checkedShopping,
		ingredientPrices,
		hydrationGlasses: row?.hydration_glasses ?? defaults.hydrationGlasses,
		notifications: (row?.notifications as UserData['notifications']) ?? defaults.notifications,
		onboarded: row?.onboarded ?? false,
		planId: activePlan?.id ?? null,
		userRecipes
	};
}

export async function saveProfile(
	supabase: SupabaseClient,
	userId: string,
	data: Pick<UserData, 'profile' | 'onboarded' | 'hydrationGlasses' | 'notifications'>
) {
	const { error } = await supabase.from('profiles').upsert({
		id: userId,
		profile_data: data.profile,
		onboarded: data.onboarded,
		hydration_glasses: data.hydrationGlasses,
		notifications: data.notifications,
		updated_at: new Date().toISOString()
	});
	if (error) throw error;
}

export async function saveHousehold(
	supabase: SupabaseClient,
	userId: string,
	household: HouseholdMember[]
) {
	await supabase.from('household_members').delete().eq('user_id', userId);
	if (household.length === 0) return;
	const { error } = await supabase.from('household_members').insert(
		household.map((m) => ({ id: m.id, user_id: userId, data: m }))
	);
	if (error) throw error;
}

export async function savePantry(supabase: SupabaseClient, userId: string, pantry: PantryItem[]) {
	await supabase.from('pantry_items').delete().eq('user_id', userId);
	if (pantry.length === 0) return;
	const { error } = await supabase.from('pantry_items').insert(
		pantry.map((p) => ({
			user_id: userId,
			ingredient_id: p.ingredientId,
			amount: p.amount,
			unit: p.unit
		}))
	);
	if (error) throw error;
}

export async function saveMealPlan(
	supabase: SupabaseClient,
	userId: string,
	plan: PlannedDay[],
	checkedShopping: string[],
	existingPlanId: string | null
): Promise<string> {
	const weekStart = plan[0]?.date ?? new Date().toISOString().slice(0, 10);

	if (existingPlanId) {
		const { error } = await supabase
			.from('meal_plans')
			.update({ days: plan, checked_shopping: checkedShopping, week_start: weekStart })
			.eq('id', existingPlanId)
			.eq('user_id', userId);
		if (error) throw error;
		return existingPlanId;
	}

	await supabase.from('meal_plans').update({ is_active: false }).eq('user_id', userId);

	const { data, error } = await supabase
		.from('meal_plans')
		.insert({
			user_id: userId,
			week_start: weekStart,
			days: plan,
			checked_shopping: checkedShopping,
			is_active: true
		})
		.select('id')
		.single();

	if (error) throw error;
	return data.id;
}

export async function saveFavorites(
	supabase: SupabaseClient,
	userId: string,
	favorites: string[]
) {
	await supabase.from('favorites').delete().eq('user_id', userId);
	if (favorites.length === 0) return;
	const { error } = await supabase.from('favorites').insert(
		favorites.map((recipe_id) => ({ user_id: userId, recipe_id }))
	);
	if (error) throw error;
}

export async function saveIngredientPrices(
	supabase: SupabaseClient,
	userId: string,
	prices: UserIngredientPrice[]
) {
	await supabase.from('user_ingredient_prices').delete().eq('user_id', userId);
	if (prices.length === 0) return;
	const { error } = await supabase.from('user_ingredient_prices').insert(
		prices.map((p) => ({
			user_id: userId,
			ingredient_id: p.ingredientId,
			price: p.price,
			per_unit: p.perUnit
		}))
	);
	if (error) throw error;
}

export function pantryFromOnboardingIds(
	pantryIds: string[],
	ingredientMap: Record<string, Ingredient>
): PantryItem[] {
	return pantryIds
		.filter((id) => ingredientMap[id])
		.map((id) => {
			const ing = ingredientMap[id];
			return {
				ingredientId: id,
				amount: ing.unit === 'kg' || ing.unit === 'l' ? 1 : 500,
				unit: ing.unit === 'kg' ? 'g' : ing.unit === 'l' ? 'ml' : ing.unit
			};
		});
}

export function primaryMemberFromProfile(profile: UserProfile): HouseholdMember {
	return {
		id: 'primary',
		name: profile.name || 'You',
		relation: 'You',
		age: profile.age ?? 30,
		sex: profile.sex ?? 'Other',
		height: profile.height ?? 170,
		weight: profile.weight ?? 70,
		activity: profile.activity ?? 'Moderate',
		goals: profile.goals,
		diet: profile.diet ?? 'Omnivore',
		allergies: profile.allergies,
		avoid: profile.avoid ? profile.avoid.split(',').map((s) => s.trim()).filter(Boolean) : [],
		eatsEveryMeal: true,
		enabled: true,
		disabledForWeek: null,
		isPrimary: true,
		avatarColor: 'oklch(0.62 0.13 155)'
	};
}
