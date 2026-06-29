import { allergyOptions } from '$lib/meta';

/** Allergens tied to animal products — irrelevant once someone eats fully plant-based. */
export const nonVeganAllergies = ['Dairy', 'Eggs', 'Fish', 'Shellfish'] as const;

export function getAllergyOptionsForDiet(diet: string | null | undefined): readonly string[] {
	if (diet === 'Vegan') {
		return allergyOptions.filter((a) => !nonVeganAllergies.includes(a as (typeof nonVeganAllergies)[number]));
	}
	return allergyOptions;
}

export function stripNonVeganAllergies(allergies: string[]): string[] {
	return allergies.filter((a) => !nonVeganAllergies.includes(a as (typeof nonVeganAllergies)[number]));
}

export interface NutrientGuidanceItem {
	nutrient: string;
	detail: string;
}

export interface NutrientGuidance {
	title: string;
	intro: string;
	oftenLowerLabel: string;
	oftenLower: string[];
	coveredByMeals: NutrientGuidanceItem[];
	supplement: NutrientGuidanceItem[];
	locationNote?: string;
}

interface DietProfile {
	oftenLower: string[];
	coveredByMeals: NutrientGuidanceItem[];
	supplement: NutrientGuidanceItem[];
}

interface LocationProfile {
	label: string;
	match: (country: string, region?: string) => boolean;
	context: string;
	oftenLower: string[];
	coveredByMeals: NutrientGuidanceItem[];
	supplement: NutrientGuidanceItem[];
}

function normalizeLocation(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

function unique(items: string[]) {
	return [...new Set(items)];
}

function mergeItems(...groups: NutrientGuidanceItem[][]): NutrientGuidanceItem[] {
	const seen = new Set<string>();
	const merged: NutrientGuidanceItem[] = [];
	for (const group of groups) {
		for (const item of group) {
			const key = item.nutrient.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			merged.push(item);
		}
	}
	return merged;
}

const dietProfiles: Record<string, DietProfile> = {
	Omnivore: {
		oftenLower: ['Fiber', 'Vitamin D', 'Omega-3', 'Iodine', 'Potassium'],
		coveredByMeals: [
			{ nutrient: 'Protein', detail: 'lean meats, fish & legumes rotated through your week' },
			{ nutrient: 'Iron', detail: 'red meat, poultry & vitamin C pairings when included' },
			{ nutrient: 'Fiber', detail: 'whole grains, vegetables & legumes in every day' },
			{ nutrient: 'Omega-3', detail: 'fatty fish such as salmon & mackerel on fish days' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'often needed in northern climates with limited sun' },
			{ nutrient: 'Omega-3', detail: 'if you eat fish less than twice a week' }
		]
	},
	Vegetarian: {
		oftenLower: ['Vitamin B12', 'Iron', 'Omega-3', 'Zinc', 'Iodine', 'Vitamin D'],
		coveredByMeals: [
			{ nutrient: 'Iron', detail: 'eggs, legumes, spinach & vitamin C pairings' },
			{ nutrient: 'Zinc', detail: 'dairy, eggs, seeds & whole grains' },
			{ nutrient: 'Protein', detail: 'eggs, dairy, tofu & legumes across the week' },
			{ nutrient: 'Omega-3 (ALA)', detail: 'walnuts, flax & chia in meals' }
		],
		supplement: [
			{ nutrient: 'Vitamin B12', detail: 'hard to get enough without animal meat or fortified foods' },
			{ nutrient: 'Vitamin D', detail: 'recommended if sun exposure is limited' },
			{ nutrient: 'Omega-3 (DHA/EPA)', detail: 'algae-based if you do not eat fish' }
		]
	},
	Vegan: {
		oftenLower: ['Vitamin B12', 'Iron', 'Omega-3', 'Zinc', 'Vitamin D', 'Calcium', 'Iodine'],
		coveredByMeals: [
			{ nutrient: 'Iron', detail: 'legumes, lentils, spinach & vitamin C pairings' },
			{ nutrient: 'Zinc', detail: 'tofu, seeds, chickpeas & whole grains' },
			{ nutrient: 'Omega-3 (ALA)', detail: 'chia, flax & walnuts built into meals' },
			{ nutrient: 'Calcium', detail: 'fortified plant milk, tahini & tofu' },
			{ nutrient: 'Protein', detail: 'balanced plant proteins across the week' }
		],
		supplement: [
			{ nutrient: 'Vitamin B12', detail: 'essential — not reliably available from plants alone' },
			{ nutrient: 'Vitamin D', detail: 'recommended if sun exposure is limited' },
			{ nutrient: 'Omega-3 (DHA/EPA)', detail: 'algae-based; ALA from food may not convert enough' },
			{ nutrient: 'Iodine', detail: 'consider if you do not use iodized salt regularly' }
		]
	},
	Mediterranean: {
		oftenLower: ['Vitamin D', 'Iron', 'Vitamin B12', 'Iodine'],
		coveredByMeals: [
			{ nutrient: 'Healthy fats', detail: 'olive oil, nuts & fatty fish in your plan' },
			{ nutrient: 'Fiber', detail: 'vegetables, legumes & whole grains daily' },
			{ nutrient: 'Omega-3', detail: 'fish, walnuts & flax on rotation' },
			{ nutrient: 'Antioxidants', detail: 'colorful vegetables & herbs throughout the week' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'still often low away from the Mediterranean sun belt' },
			{ nutrient: 'Vitamin B12', detail: 'if fish, dairy & eggs are limited in practice' }
		]
	},
	Keto: {
		oftenLower: ['Fiber', 'Electrolytes', 'Magnesium', 'Potassium', 'Vitamin C'],
		coveredByMeals: [
			{ nutrient: 'Electrolytes', detail: 'sodium from whole foods, avocados & leafy greens' },
			{ nutrient: 'Magnesium', detail: 'nuts, seeds, spinach & dark chocolate in moderation' },
			{ nutrient: 'Healthy fats', detail: 'olive oil, eggs, fish & avocado across meals' }
		],
		supplement: [
			{ nutrient: 'Magnesium', detail: 'often helpful during the adaptation phase' },
			{ nutrient: 'Fiber', detail: 'psyllium or extra low-carb vegetables if intake is very low' }
		]
	},
	'Low Carb': {
		oftenLower: ['Fiber', 'Vitamin D', 'Potassium', 'Magnesium'],
		coveredByMeals: [
			{ nutrient: 'Protein', detail: 'eggs, fish, poultry & tofu on rotation' },
			{ nutrient: 'Fiber', detail: 'non-starchy vegetables at every meal' },
			{ nutrient: 'Healthy fats', detail: 'olive oil, nuts & fatty fish' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'if sun exposure is limited' },
			{ nutrient: 'Magnesium', detail: 'if muscle cramps or poor sleep appear' }
		]
	},
	Paleo: {
		oftenLower: ['Calcium', 'Fiber', 'Vitamin D', 'Iodine'],
		coveredByMeals: [
			{ nutrient: 'Protein', detail: 'meat, fish & eggs as meal anchors' },
			{ nutrient: 'Fiber', detail: 'vegetables, fruit & nuts throughout the week' },
			{ nutrient: 'Omega-3', detail: 'fatty fish & grass-fed meat on rotation' }
		],
		supplement: [
			{ nutrient: 'Calcium', detail: 'if dairy is excluded entirely' },
			{ nutrient: 'Vitamin D', detail: 'recommended in low-sun regions' }
		]
	},
	'Traditional Chinese Medicine': {
		oftenLower: ['Vitamin D', 'Omega-3', 'Iron', 'B vitamins'],
		coveredByMeals: [
			{ nutrient: 'Warm, balanced meals', detail: 'cooked vegetables, grains & gentle proteins' },
			{ nutrient: 'Gut support', detail: 'ginger, garlic & fermented foods where appropriate' },
			{ nutrient: 'Seasonal variety', detail: 'rotating ingredients to match the time of year' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'if you live in a low-sun climate' },
			{ nutrient: 'B12', detail: 'if animal foods are kept very minimal' }
		]
	},
	Ayurvedic: {
		oftenLower: ['Vitamin D', 'Omega-3', 'Iron', 'B12'],
		coveredByMeals: [
			{ nutrient: 'Digestive balance', detail: 'spices, cooked lentils & seasonal vegetables' },
			{ nutrient: 'Healthy fats', detail: 'ghee or olive oil used thoughtfully in cooking' },
			{ nutrient: 'Plant diversity', detail: 'grains, legumes & vegetables across the week' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'common gap in northern European climates' },
			{ nutrient: 'B12', detail: 'if dairy & eggs are limited' }
		]
	}
};

const locationProfiles: LocationProfile[] = [
	{
		label: 'Germany',
		match: (country, region) => {
			const c = normalizeLocation(country);
			const r = normalizeLocation(region ?? '');
			return (
				c.includes('germany') ||
				c.includes('deutschland') ||
				c === 'de' ||
				r.includes('bavaria') ||
				r.includes('bayern')
			);
		},
		context:
			'In Germany, iodine levels in soil and food are historically low, winters limit vitamin D synthesis, and average fish intake often falls short of omega-3 recommendations.',
		oftenLower: ['Vitamin D', 'Iodine', 'Omega-3'],
		coveredByMeals: [
			{
				nutrient: 'Vitamin D',
				detail: 'fatty fish, egg yolks & vitamin D-rich mushrooms in your plan'
			},
			{
				nutrient: 'Iodine',
				detail: 'eggs, dairy, seaweed & iodized salt used in cooking'
			},
			{
				nutrient: 'Omega-3',
				detail: 'salmon, mackerel, herring & walnuts scheduled weekly'
			}
		],
		supplement: [
			{
				nutrient: 'Vitamin D',
				detail: 'widely recommended from October to March in Germany'
			},
			{
				nutrient: 'Iodine',
				detail: 'consider if you avoid iodized salt, dairy & seaweed'
			},
			{
				nutrient: 'Omega-3 (EPA/DHA)',
				detail: 'fish oil or algae oil if you eat fish less than twice a week'
			}
		]
	},
	{
		label: 'Northern Europe',
		match: (country) => {
			const c = normalizeLocation(country);
			return (
				c.includes('netherlands') ||
				c.includes('niederlande') ||
				c.includes('belgium') ||
				c.includes('poland') ||
				c.includes('sweden') ||
				c.includes('norway') ||
				c.includes('denmark') ||
				c.includes('finland') ||
				c.includes('austria') ||
				c.includes('osterreich') ||
				c.includes('switzerland') ||
				c.includes('schweiz')
			);
		},
		context:
			'Northern European climates mean less year-round sun for vitamin D, and iodine can be inconsistent depending on diet and salt choices.',
		oftenLower: ['Vitamin D', 'Iodine', 'Omega-3'],
		coveredByMeals: [
			{ nutrient: 'Vitamin D', detail: 'fatty fish, eggs & fortified foods in rotation' },
			{ nutrient: 'Omega-3', detail: 'salmon, herring, mackerel & flax built into meals' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'commonly advised during darker months' },
			{ nutrient: 'Omega-3', detail: 'if fish is not a regular part of your week' }
		]
	},
	{
		label: 'United States',
		match: (country) => {
			const c = normalizeLocation(country);
			return c.includes('united states') || c === 'usa' || c === 'us' || c.includes('america');
		},
		context:
			'Many Americans fall short on vitamin D, potassium, fiber and omega-3 despite a varied diet.',
		oftenLower: ['Vitamin D', 'Fiber', 'Potassium', 'Omega-3'],
		coveredByMeals: [
			{ nutrient: 'Fiber', detail: 'beans, oats, vegetables & fruit across the week' },
			{ nutrient: 'Potassium', detail: 'bananas, potatoes, leafy greens & legumes' },
			{ nutrient: 'Omega-3', detail: 'salmon, sardines & walnuts on rotation' }
		],
		supplement: [
			{ nutrient: 'Vitamin D', detail: 'common gap, especially in northern states' },
			{ nutrient: 'Omega-3', detail: 'if seafood intake is low' }
		]
	}
];

const defaultLocationProfile: LocationProfile = {
	label: 'your region',
	match: () => true,
	context:
		'Where you live affects sun exposure, soil minerals and local food habits — all of which influence what you may be low in.',
	oftenLower: ['Vitamin D', 'Omega-3', 'Iodine'],
	coveredByMeals: [
		{ nutrient: 'Vitamin D', detail: 'fatty fish, eggs & fortified foods in your plan' },
		{ nutrient: 'Omega-3', detail: 'fish, walnuts & flax scheduled across the week' }
	],
	supplement: [
		{ nutrient: 'Vitamin D', detail: 'often needed when sun exposure is limited' },
		{ nutrient: 'Omega-3', detail: 'if fish is not eaten regularly' }
	]
};

function resolveLocation(country?: string, region?: string): LocationProfile {
	if (!country?.trim()) return defaultLocationProfile;
	const match = locationProfiles.find((p) => p.match(country, region));
	return match ?? defaultLocationProfile;
}

/**
 * Build personalized nutrient guidance from diet and optional location.
 * Location refines gaps — e.g. Germany adds iodine & vitamin D context for omnivores too.
 */
export function buildNutrientGuidance(
	diet: string | null | undefined,
	country?: string,
	region?: string
): NutrientGuidance | null {
	if (!diet) return null;

	const dietProfile = dietProfiles[diet] ?? dietProfiles.Omnivore;
	const hasLocation = Boolean(country?.trim());
	const location = hasLocation ? resolveLocation(country, region) : null;

	const oftenLower = unique([
		...dietProfile.oftenLower,
		...(location?.oftenLower ?? [])
	]);

	const coveredByMeals = mergeItems(
		dietProfile.coveredByMeals,
		location?.coveredByMeals ?? []
	);

	const supplement = mergeItems(dietProfile.supplement, location?.supplement ?? []);

	let intro: string;
	let locationNote: string | undefined;

	if (location && hasLocation) {
		intro = `As a ${diet.toLowerCase()} eater in ${location.label}, a few nutrients deserve extra attention. NutriFlow shapes your meals around this — but some gaps are hard to close with food alone.`;
		locationNote = location.context;
	} else {
		intro = `As a ${diet.toLowerCase()} eater, many people run low on a handful of key nutrients. Add your location in the next steps to refine this for where you live.`;
	}

	const oftenLowerLabel =
		diet === 'Vegan' || diet === 'Vegetarian'
			? 'Often lower on your diet'
			: 'Commonly low — diet & lifestyle';

	return {
		title: `What to watch as a ${diet.toLowerCase()} eater`,
		intro,
		oftenLowerLabel,
		oftenLower,
		coveredByMeals,
		supplement,
		locationNote
	};
}

/** @deprecated Use buildNutrientGuidance('Vegan', country) */
export const veganNutrientGuidance = buildNutrientGuidance('Vegan')!;
