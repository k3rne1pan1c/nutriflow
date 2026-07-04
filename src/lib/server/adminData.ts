import { createSupabaseAdmin } from '$lib/server/supabaseAdmin';
import type { Recipe, UserProfile } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminDb = SupabaseClient<any, 'public', any>;

export type AdminUserRow = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
	onboarded: boolean;
	isAdmin: boolean;
	aiGenerations: number;
	aiGenerationsToday: number;
	recipeCount: number;
	activePlan: boolean;
};

export type AdminRecipeRow = {
	id: string;
	title: string;
	mealType: string;
	cuisine: string;
	calories: number;
	isAi: boolean;
	userCount: number;
	createdVia: 'catalog' | 'ai' | 'mixed';
};

export type AdminOverview = {
	totalUsers: number;
	totalGenerations: number;
	generationsToday: number;
	totalRecipes: number;
	aiRecipes: number;
	totalAssignments: number;
};

function profileName(data: UserProfile | Record<string, unknown>): string {
	const p = data as UserProfile;
	return p.name?.trim() || '—';
}

function startOfTodayIso(): string {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d.toISOString();
}

export async function loadAdminOverview(): Promise<AdminOverview> {
	const admin = createSupabaseAdmin() as AdminDb;
	const today = startOfTodayIso();

	const [usersRes, genRes, genTodayRes, recipesRes, aiRecipeRes, assignmentsRes] =
		await Promise.all([
			admin.from('profiles').select('id', { count: 'exact', head: true }),
			admin.from('plan_generations').select('id', { count: 'exact', head: true }),
			admin
				.from('plan_generations')
				.select('id', { count: 'exact', head: true })
				.gte('created_at', today),
			admin.from('recipes').select('id', { count: 'exact', head: true }),
			admin.from('recipes').select('id', { count: 'exact', head: true }).like('id', 'ai-%'),
			admin.from('user_recipes').select('user_id', { count: 'exact', head: true })
		]);

	return {
		totalUsers: usersRes.count ?? 0,
		totalGenerations: genRes.count ?? 0,
		generationsToday: genTodayRes.count ?? 0,
		totalRecipes: recipesRes.count ?? 0,
		aiRecipes: aiRecipeRes.count ?? 0,
		totalAssignments: assignmentsRes.count ?? 0
	};
}

export async function loadAdminUsers(): Promise<AdminUserRow[]> {
	const admin = createSupabaseAdmin() as AdminDb;
	const today = startOfTodayIso();

	const { data: profiles, error: profileError } = await admin
		.from('profiles')
		.select('id, profile_data, onboarded, created_at, is_admin')
		.order('created_at', { ascending: false });

	if (profileError) throw profileError;

	const { data: authData, error: authError } = await admin.auth.admin.listUsers({
		page: 1,
		perPage: 1000
	});
	if (authError) throw authError;

	const emailById = new Map(authData.users.map((u) => [u.id, u.email ?? '']));

	const userIds = profiles?.map((p) => p.id) ?? [];

	const [gens, gensToday, userRecipes, activePlans] = await Promise.all([
		admin.from('plan_generations').select('user_id').in('user_id', userIds),
		admin
			.from('plan_generations')
			.select('user_id')
			.in('user_id', userIds)
			.gte('created_at', today),
		admin.from('user_recipes').select('user_id').in('user_id', userIds),
		admin
			.from('meal_plans')
			.select('user_id')
			.in('user_id', userIds)
			.eq('is_active', true)
	]);

	const countBy = (rows: { user_id: string }[] | null) => {
		const map = new Map<string, number>();
		for (const row of rows ?? []) {
			map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
		}
		return map;
	};

	const genMap = countBy(gens.data);
	const genTodayMap = countBy(gensToday.data);
	const recipeMap = countBy(userRecipes.data);
	const activeSet = new Set((activePlans.data ?? []).map((r) => r.user_id));

	return (profiles ?? []).map((p) => ({
		id: p.id,
		email: emailById.get(p.id) ?? '—',
		name: profileName(p.profile_data as UserProfile),
		createdAt: p.created_at,
		onboarded: p.onboarded,
		isAdmin: Boolean(p.is_admin),
		aiGenerations: genMap.get(p.id) ?? 0,
		aiGenerationsToday: genTodayMap.get(p.id) ?? 0,
		recipeCount: recipeMap.get(p.id) ?? 0,
		activePlan: activeSet.has(p.id)
	}));
}

export async function loadAdminUserDetail(userId: string) {
	const admin = createSupabaseAdmin() as AdminDb;

	const { data: profile, error: profileError } = await admin
		.from('profiles')
		.select('id, profile_data, onboarded, created_at, is_admin')
		.eq('id', userId)
		.single();
	if (profileError) throw profileError;

	const { data: authUser } = await admin.auth.admin.getUserById(userId);

	const [generations, userRecipeLinks, recipes, activePlan] = await Promise.all([
		admin
			.from('plan_generations')
			.select('id, created_at')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })
			.limit(50),
		admin
			.from('user_recipes')
			.select('recipe_id, source, created_at')
			.eq('user_id', userId)
			.order('created_at', { ascending: false }),
		admin.from('recipes').select('id, data'),
		admin
			.from('meal_plans')
			.select('id, week_start, created_at, is_active')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })
			.limit(10)
	]);

	const recipeMap = new Map(
		(recipes.data ?? []).map((r) => [r.id, r.data as Recipe])
	);

	const userRecipes = (userRecipeLinks.data ?? []).map((link) => {
		const recipe = recipeMap.get(link.recipe_id);
		return {
			recipeId: link.recipe_id,
			source: link.source as 'ai' | 'admin',
			createdAt: link.created_at,
			title: recipe?.title ?? link.recipe_id,
			mealType: recipe?.mealType ?? '—'
		};
	});

	return {
		id: profile.id,
		email: authUser.user?.email ?? '—',
		name: profileName(profile.profile_data as UserProfile),
		profile: profile.profile_data,
		onboarded: profile.onboarded,
		isAdmin: Boolean(profile.is_admin),
		createdAt: profile.created_at,
		generations: generations.data ?? [],
		userRecipes,
		plans: activePlan.data ?? []
	};
}

export async function loadAdminRecipes(): Promise<AdminRecipeRow[]> {
	const admin = createSupabaseAdmin() as AdminDb;

	const [{ data: recipes, error: recipeError }, { data: links, error: linkError }] =
		await Promise.all([
			admin.from('recipes').select('id, data').order('id'),
			admin.from('user_recipes').select('recipe_id, source')
		]);

	if (recipeError) throw recipeError;
	if (linkError) throw linkError;

	const linkStats = new Map<string, { count: number; hasAi: boolean; hasAdmin: boolean }>();
	for (const link of links ?? []) {
		const stat = linkStats.get(link.recipe_id) ?? { count: 0, hasAi: false, hasAdmin: false };
		stat.count++;
		if (link.source === 'ai') stat.hasAi = true;
		if (link.source === 'admin') stat.hasAdmin = true;
		linkStats.set(link.recipe_id, stat);
	}

	return (recipes ?? []).map((row) => {
		const recipe = row.data as Recipe;
		const stat = linkStats.get(row.id);
		const isAi = row.id.startsWith('ai-');
		let createdVia: AdminRecipeRow['createdVia'] = 'catalog';
		if (isAi) createdVia = 'ai';
		else if (stat?.hasAdmin) createdVia = 'mixed';

		return {
			id: row.id,
			title: recipe.title,
			mealType: recipe.mealType,
			cuisine: recipe.cuisine,
			calories: recipe.nutrition?.calories ?? 0,
			isAi,
			userCount: stat?.count ?? 0,
			createdVia
		};
	});
}

export async function assignRecipesToUsers(
	recipeIds: string[],
	userIds: string[],
	adminEmail: string
) {
	if (recipeIds.length === 0 || userIds.length === 0) {
		throw new Error('Select at least one recipe and one user');
	}

	const admin = createSupabaseAdmin() as AdminDb;
	const rows = userIds.flatMap((userId) =>
		recipeIds.map((recipeId) => ({
			user_id: userId,
			recipe_id: recipeId,
			source: 'admin' as const
		}))
	);

	const { error } = await admin.from('user_recipes').upsert(rows, {
		onConflict: 'user_id,recipe_id',
		ignoreDuplicates: false
	});
	if (error) throw error;

	console.info(
		`[admin] ${adminEmail} assigned ${recipeIds.length} recipe(s) to ${userIds.length} user(s)`
	);

	return { assigned: rows.length };
}

export async function setUserAdmin(userId: string, isAdmin: boolean, actorEmail: string) {
	const admin = createSupabaseAdmin() as AdminDb;

	const { error } = await admin.from('profiles').update({ is_admin: isAdmin }).eq('id', userId);
	if (error) throw error;

	console.info(`[admin] ${actorEmail} set is_admin=${isAdmin} for user ${userId}`);
}
