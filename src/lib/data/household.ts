import type { HouseholdMember } from '$lib/types';

export const householdMembers: HouseholdMember[] = [
	{
		id: 'primary',
		name: 'Alex',
		relation: 'You',
		age: 31,
		sex: 'Male',
		height: 180,
		weight: 78,
		activity: 'Moderate',
		goals: ['Longevity', 'Muscle Gain'],
		diet: 'Mediterranean',
		allergies: [],
		avoid: ['Cilantro'],
		eatsEveryMeal: true,
		enabled: true,
		isPrimary: true,
		avatarColor: 'oklch(0.62 0.13 155)'
	},
	{
		id: 'partner',
		name: 'Mia',
		relation: 'Partner',
		age: 29,
		sex: 'Female',
		height: 167,
		weight: 61,
		activity: 'Active',
		goals: ['Energy', 'Healthy Skin'],
		diet: 'Vegetarian',
		allergies: ['Shellfish'],
		avoid: [],
		eatsEveryMeal: true,
		enabled: true,
		avatarColor: 'oklch(0.65 0.16 25)'
	},
	{
		id: 'child',
		name: 'Leo',
		relation: 'Child',
		age: 7,
		sex: 'Male',
		height: 124,
		weight: 24,
		activity: 'Active',
		goals: ['Brain Health'],
		diet: 'Omnivore',
		allergies: ['Peanuts'],
		avoid: ['Spicy food'],
		eatsEveryMeal: false,
		enabled: true,
		avatarColor: 'oklch(0.7 0.12 250)'
	}
];

/** A child counts as ~0.6 of an adult portion for quantity scaling. */
export function servingFactor(member: HouseholdMember): number {
	if (member.age < 12) return 0.6;
	if (member.age < 18) return 0.85;
	return 1;
}
