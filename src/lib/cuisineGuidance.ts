import { cuisineOptions } from '$lib/meta';

export interface CuisineRecommendation {
	/** Display name for the matched region, e.g. "Germany". */
	regionLabel: string;
	context: string;
	/** Cuisine names from {@link cuisineOptions}, in priority order. */
	cuisines: string[];
}

function normalize(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

interface LocationCuisineProfile {
	label: string;
	match: (country: string, region?: string) => boolean;
	context: string;
	cuisines: string[];
}

const locationCuisineProfiles: LocationCuisineProfile[] = [
	{
		label: 'Germany',
		match: (country, region) => {
			const c = normalize(country);
			const r = normalize(region ?? '');
			return (
				c.includes('germany') ||
				c.includes('deutschland') ||
				c === 'de' ||
				r.includes('bavaria') ||
				r.includes('bayern')
			);
		},
		context:
			'Fresh local produce, bakeries and weekly markets make German cooking practical — with Italian, Turkish and Asian cuisines widely available in cities.',
		cuisines: ['German', 'Italian', 'Turkish', 'Greek', 'Vietnamese', 'Chinese']
	},
	{
		label: 'Northern Europe',
		match: (country) => {
			const c = normalize(country);
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
			'Seasonal northern-European ingredients pair well with Mediterranean and Asian influences found in most supermarkets.',
		cuisines: ['German', 'Mediterranean', 'Italian', 'Turkish', 'Vietnamese', 'Indian']
	},
	{
		label: 'United States',
		match: (country) => {
			const c = normalize(country);
			return c.includes('united states') || c === 'usa' || c === 'us' || c.includes('america');
		},
		context:
			'American grocery aisles make Mexican, Italian and Asian cooking especially accessible year-round.',
		cuisines: ['American', 'Mexican', 'Italian', 'Chinese', 'Japanese', 'Indian']
	},
	{
		label: 'Japan',
		match: (country) => {
			const c = normalize(country);
			return c.includes('japan') || c === 'jp';
		},
		context: 'Japanese home cooking is the natural anchor — with Chinese and Korean dishes easy to source locally.',
		cuisines: ['Japanese', 'Chinese', 'Korean', 'Italian', 'Thai']
	},
	{
		label: 'Thailand',
		match: (country) => {
			const c = normalize(country);
			return c.includes('thailand') || c === 'th';
		},
		context: 'Thai markets offer incredible fresh herbs and produce — with Chinese and Japanese staples close at hand.',
		cuisines: ['Thai', 'Chinese', 'Japanese', 'Vietnamese', 'Indian']
	},
	{
		label: 'Italy',
		match: (country) => {
			const c = normalize(country);
			return c.includes('italy') || c.includes('italia') || c === 'it';
		},
		context: 'Regional Italian cooking is the obvious fit — Mediterranean and Greek flavors are equally local.',
		cuisines: ['Italian', 'Mediterranean', 'Greek', 'Japanese', 'Chinese']
	},
	{
		label: 'United Kingdom',
		match: (country) => {
			const c = normalize(country);
			return (
				c.includes('united kingdom') ||
				c.includes('britain') ||
				c === 'uk' ||
				c.includes('england') ||
				c.includes('scotland') ||
				c.includes('wales')
			);
		},
		context:
			'British ingredients meet a rich takeaway culture — Indian, Chinese and Mediterranean cuisines are everywhere.',
		cuisines: ['Mediterranean', 'Indian', 'Chinese', 'Italian', 'Thai', 'Turkish']
	},
	{
		label: 'Mexico',
		match: (country) => {
			const c = normalize(country);
			return c.includes('mexico') || c === 'mx';
		},
		context: 'Mexican cooking is deeply local — with American and Asian ingredients easy to find in cities.',
		cuisines: ['Mexican', 'American', 'Italian', 'Chinese', 'Japanese', 'Mediterranean']
	}
];

const defaultProfile: LocationCuisineProfile = {
	label: 'your area',
	match: () => true,
	context:
		'We suggest cuisines with ingredients that are usually easy to find near you — you can always pick others you prefer.',
	cuisines: ['Mediterranean', 'Italian', 'Chinese', 'Japanese', 'Indian', 'Thai']
};

function resolveProfile(country: string, region?: string): LocationCuisineProfile {
	const match = locationCuisineProfiles.find((p) => p.match(country, region));
	return match ?? defaultProfile;
}

function validCuisines(names: string[]): string[] {
	const allowed = new Set<string>(cuisineOptions);
	return names.filter((c) => allowed.has(c));
}

/** Recommend cuisines based on where the user lives. */
export function getRecommendedCuisines(
	country?: string,
	region?: string
): CuisineRecommendation | null {
	if (!country?.trim()) return null;

	const profile = resolveProfile(country, region);
	const cuisines = validCuisines(profile.cuisines);

	if (cuisines.length === 0) return null;

	return {
		regionLabel: profile.label,
		context: profile.context,
		cuisines
	};
}

/** Apply recommended cuisines, keeping any the user already picked. */
export function applyRecommendedCuisines(current: string[], recommended: string[]): string[] {
	return [...new Set([...recommended, ...current])];
}
