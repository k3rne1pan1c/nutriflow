import type { HouseholdMember, MealType, UserProfile } from '$lib/types';

const DIET_STRICTNESS = ['Omnivore', 'Pescatarian', 'Vegetarian', 'Vegan'] as const;

/** A child counts as ~0.6 of an adult portion for quantity scaling. */
export function servingFactor(member: HouseholdMember): number {
	if (member.age < 12) return 0.6;
	if (member.age < 18) return 0.85;
	return 1;
}

export function isMemberActiveForWeek(member: HouseholdMember, weekStart: string | null): boolean {
	if (!member.enabled) return false;
	if (!weekStart || !member.disabledForWeek) return true;
	return member.disabledForWeek !== weekStart;
}

export function activeMembersForWeek(
	household: HouseholdMember[],
	weekStart: string | null
): HouseholdMember[] {
	return household.filter((m) => isMemberActiveForWeek(m, weekStart));
}

/** Members who eat a given meal type (breakfast/snack exclude eatsEveryMeal=false). */
export function membersForMeal(
	members: HouseholdMember[],
	mealType: MealType
): HouseholdMember[] {
	if (mealType === 'breakfast' || mealType === 'snack') {
		return members.filter((m) => m.eatsEveryMeal);
	}
	return members;
}

export function mealServingFactor(members: HouseholdMember[], mealType: MealType): number {
	const relevant = membersForMeal(members, mealType);
	const factor = relevant.reduce((sum, m) => sum + servingFactor(m), 0);
	return factor || 1;
}

export function householdServingFactor(members: HouseholdMember[]): number {
	const factor = members.reduce((sum, m) => sum + servingFactor(m), 0);
	return factor || 1;
}

export function strictestDiet(diets: string[]): string | null {
	if (diets.length === 0) return null;
	let strictest = 0;
	for (const diet of diets) {
		const idx = DIET_STRICTNESS.indexOf(diet as (typeof DIET_STRICTNESS)[number]);
		if (idx > strictest) strictest = idx;
	}
	return DIET_STRICTNESS[strictest] ?? diets[0];
}

export function parseAvoidTerms(avoid: string | string[] | null | undefined): string[] {
	if (!avoid) return [];
	if (Array.isArray(avoid)) {
		return avoid.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
	}
	return avoid
		.split(/[,;]/)
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
}

export function memberToProfile(member: HouseholdMember): UserProfile {
	return {
		name: member.name,
		age: member.age,
		sex: member.sex,
		height: member.height,
		weight: member.weight,
		targetWeight: null,
		activity: member.activity,
		goals: member.goals,
		diet: member.diet,
		allergies: member.allergies,
		avoid: member.avoid.join(', '),
		cuisines: [],
		experience: null,
		equipment: [],
		maxCookingTime: 60,
		weeklyBudget: 120,
		country: '',
		region: '',
		city: '',
		pantry: []
	};
}
