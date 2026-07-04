import { z } from 'zod';
import type { Difficulty, Ingredient, MealType, Recipe, RecipeIngredient, Unit } from '$lib/types';

const UNITS = ['g', 'kg', 'ml', 'l', 'pcs', 'tbsp', 'tsp', 'cup', 'clove', 'bunch'] as const;
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

function coerceInt(val: unknown, fallback = 0): number {
	const n = Number(val);
	if (!Number.isFinite(n)) return fallback;
	return Math.round(n);
}

function coerceFloat(val: unknown, fallback = 0): number {
	const n = Number(val);
	return Number.isFinite(n) ? n : fallback;
}

function normalizeDifficulty(val: unknown): (typeof DIFFICULTIES)[number] {
	if (typeof val !== 'string') return 'Medium';
	const s = val.trim().toLowerCase();
	if (['easy', 'beginner', 'simple', 'quick'].includes(s)) return 'Easy';
	if (['hard', 'advanced', 'difficult', 'expert'].includes(s)) return 'Hard';
	if (['medium', 'intermediate', 'moderate'].includes(s)) return 'Medium';
	for (const d of DIFFICULTIES) {
		if (s === d.toLowerCase()) return d;
	}
	return 'Medium';
}

function normalizeUnit(val: unknown, fallback: Unit = 'g'): Unit {
	if (typeof val !== 'string') return fallback;
	const s = val.trim().toLowerCase();
	if ((UNITS as readonly string[]).includes(s)) return s as Unit;
	const aliases: Record<string, Unit> = {
		gram: 'g',
		grams: 'g',
		kilogram: 'kg',
		kilograms: 'kg',
		milliliter: 'ml',
		milliliters: 'ml',
		mls: 'ml',
		liter: 'l',
		liters: 'l',
		piece: 'pcs',
		pieces: 'pcs',
		tablespoon: 'tbsp',
		tablespoons: 'tbsp',
		teaspoon: 'tsp',
		teaspoons: 'tsp',
		cups: 'cup',
		cloves: 'clove',
		bunches: 'bunch'
	};
	return aliases[s] ?? fallback;
}

function coerceStringArray(val: unknown): string[] {
	if (!Array.isArray(val)) return [];
	return val.map((x) => String(x).trim()).filter(Boolean);
}

export const generatedRecipeSchema = z.object({
	title: z.preprocess((v) => String(v ?? '').trim(), z.string().min(3)),
	description: z.preprocess((v) => String(v ?? '').trim(), z.string().min(10)),
	cuisine: z.preprocess((v) => String(v ?? '').trim(), z.string().min(2)),
	prepTime: z.preprocess((v) => coerceInt(v, 10), z.number().int().min(0).max(120)),
	cookTime: z.preprocess((v) => coerceInt(v, 15), z.number().int().min(0).max(180)),
	difficulty: z.preprocess((v) => normalizeDifficulty(v), z.enum(DIFFICULTIES)),
	baseServings: z.preprocess((v) => Math.min(8, Math.max(1, coerceInt(v, 2))), z.number().int().min(1).max(8)),
	nutrition: z.preprocess(
		(v) => {
			const n = v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
			return {
				calories: coerceFloat(n.calories, 400),
				protein: coerceFloat(n.protein, 20),
				carbs: coerceFloat(n.carbs, 40),
				fat: coerceFloat(n.fat, 12),
				fiber: coerceFloat(n.fiber, 5)
			};
		},
		z.object({
			calories: z.number().min(50).max(2000),
			protein: z.number().min(0).max(200),
			carbs: z.number().min(0).max(300),
			fat: z.number().min(0).max(150),
			fiber: z.number().min(0).max(50)
		})
	),
	tags: z.preprocess((v) => coerceStringArray(v).slice(0, 6), z.array(z.string()).min(1).max(6)),
	ingredients: z
		.preprocess(
			(v) => (Array.isArray(v) ? v : []),
			z.array(
				z.object({
					ingredientId: z.preprocess((x) => String(x ?? '').trim(), z.string()),
					amountPerServing: z.preprocess((x) => coerceFloat(x, 1), z.number().positive()),
					unit: z.preprocess((x) => normalizeUnit(x), z.enum(UNITS))
				})
			)
		)
		.pipe(z.array(z.object({
			ingredientId: z.string(),
			amountPerServing: z.number().positive(),
			unit: z.enum(UNITS)
		})).min(2).max(16)),
	instructions: z.preprocess(
		(v) => coerceStringArray(v).slice(0, 12),
		z.array(z.string().min(3)).min(3).max(12)
	),
	healthBenefits: z.preprocess(
		(v) => coerceStringArray(v).slice(0, 5),
		z.array(z.string()).min(1).max(5)
	),
	substitutions: z
		.preprocess(
			(v) =>
				Array.isArray(v)
					? v
							.filter((x) => x && typeof x === 'object')
							.map((x) => ({
								from: String((x as { from?: unknown }).from ?? '').trim(),
								to: String((x as { to?: unknown }).to ?? '').trim()
							}))
							.filter((x) => x.from && x.to)
							.slice(0, 4)
					: [],
			z.array(z.object({ from: z.string(), to: z.string() })).max(4)
		)
		.optional()
		.transform((v) => v ?? []),
	mealPrepTips: z
		.preprocess((v) => coerceStringArray(v).slice(0, 4), z.array(z.string()).max(4))
		.optional()
		.transform((v) => v ?? [])
});

export const dayRecipesResponseSchema = {
	type: 'object',
	properties: {
		meals: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					mealType: { type: 'string' },
					reason: { type: 'string' },
					recipe: {
						type: 'object',
						properties: {
							title: { type: 'string' },
							description: { type: 'string' },
							cuisine: { type: 'string' },
							prepTime: { type: 'integer' },
							cookTime: { type: 'integer' },
							difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
							baseServings: { type: 'integer' },
							nutrition: {
								type: 'object',
								properties: {
									calories: { type: 'number' },
									protein: { type: 'number' },
									carbs: { type: 'number' },
									fat: { type: 'number' },
									fiber: { type: 'number' }
								},
								required: ['calories', 'protein', 'carbs', 'fat', 'fiber']
							},
							tags: { type: 'array', items: { type: 'string' } },
							ingredients: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										ingredientId: { type: 'string' },
										amountPerServing: { type: 'number' },
										unit: { type: 'string' }
									},
									required: ['ingredientId', 'amountPerServing', 'unit']
								}
							},
							instructions: { type: 'array', items: { type: 'string' } },
							healthBenefits: { type: 'array', items: { type: 'string' } },
							substitutions: {
								type: 'array',
								items: {
									type: 'object',
									properties: { from: { type: 'string' }, to: { type: 'string' } }
								}
							},
							mealPrepTips: { type: 'array', items: { type: 'string' } }
						},
						required: [
							'title',
							'description',
							'cuisine',
							'prepTime',
							'cookTime',
							'difficulty',
							'baseServings',
							'nutrition',
							'tags',
							'ingredients',
							'instructions',
							'healthBenefits'
						]
					}
				},
				required: ['mealType', 'reason', 'recipe']
			}
		}
	},
	required: ['meals']
} as const;

export const singleRecipeResponseSchema = {
	type: 'object',
	properties: {
		reason: { type: 'string' },
		recipe: dayRecipesResponseSchema.properties.meals.items.properties.recipe
	},
	required: ['reason', 'recipe']
} as const;

const dayMealsSchema = z.object({
	meals: z.array(
		z.object({
			mealType: z.preprocess(
				(v) => String(v ?? '').trim().toLowerCase(),
				z.enum(['breakfast', 'lunch', 'dinner', 'snack'])
			),
			reason: z.preprocess((v) => String(v ?? '').trim(), z.string().min(1)),
			recipe: generatedRecipeSchema
		})
	)
});

const singleMealSchema = z.object({
	reason: z.string(),
	recipe: generatedRecipeSchema
});

function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 48);
}

function recipeImageFor(title: string): string {
	let hash = 0;
	for (let i = 0; i < title.length; i++) hash = (hash + title.charCodeAt(i)) % 8;
	return `gradient-${hash + 1}`;
}

function uniqueRecipeId(title: string): string {
	const slug = slugify(title) || 'meal';
	const suffix = Math.random().toString(36).slice(2, 8);
	return `ai-${slug}-${suffix}`;
}

export function normalizeGeneratedRecipe(
	raw: z.infer<typeof generatedRecipeSchema>,
	mealType: MealType,
	ingredientCatalog: Ingredient[]
): Recipe {
	const allowedIds = new Set(ingredientCatalog.map((i) => i.id));
	const ingredientDefaults = Object.fromEntries(ingredientCatalog.map((i) => [i.id, i.unit]));

	const ingredients: RecipeIngredient[] = raw.ingredients
		.map((ing) => {
			const id = ingredientIdFix(ing.ingredientId, allowedIds);
			if (!id) return null;
			return {
				ingredientId: id,
				amountPerServing: Math.round(ing.amountPerServing * 10) / 10,
				unit: (UNITS.includes(ing.unit as Unit) ? ing.unit : ingredientDefaults[id]) as Unit
			};
		})
		.filter((ing): ing is RecipeIngredient => ing !== null);

	if (ingredients.length < 2) {
		throw new Error('Generated recipe used unknown ingredients');
	}

	return {
		id: uniqueRecipeId(raw.title),
		title: raw.title.trim(),
		description: raw.description.trim(),
		cuisine: raw.cuisine.trim(),
		mealType,
		image: recipeImageFor(raw.title),
		prepTime: raw.prepTime,
		cookTime: raw.cookTime,
		difficulty: raw.difficulty as Difficulty,
		baseServings: raw.baseServings,
		nutrition: {
			calories: Math.round(raw.nutrition.calories),
			protein: Math.round(raw.nutrition.protein),
			carbs: Math.round(raw.nutrition.carbs),
			fat: Math.round(raw.nutrition.fat),
			fiber: Math.round(raw.nutrition.fiber)
		},
		tags: raw.tags.slice(0, 6),
		ingredients,
		instructions: raw.instructions,
		healthBenefits: raw.healthBenefits,
		substitutions: raw.substitutions ?? [],
		mealPrepTips: raw.mealPrepTips ?? []
	};
}

function ingredientIdFix(id: string, allowed: Set<string>): string | null {
	if (allowed.has(id)) return id;
	const normalized = id.toLowerCase().replace(/\s+/g, '-');
	if (allowed.has(normalized)) return normalized;
	return null;
}

export function parseDayRecipesResponse(raw: unknown) {
	const result = dayMealsSchema.safeParse(raw);
	if (!result.success) {
		console.error('[recipeSchema] day parse issues:', result.error.issues.slice(0, 8));
		throw result.error;
	}
	return result.data;
}

export function parseSingleRecipeResponse(raw: unknown) {
	const result = singleMealSchema.safeParse(raw);
	if (!result.success) {
		console.error('[recipeSchema] single parse issues:', result.error.issues.slice(0, 8));
		throw result.error;
	}
	return result.data;
}

export function ingredientCatalogForPrompt(ingredients: Ingredient[]): string {
	return JSON.stringify(
		ingredients.map((i) => ({ id: i.id, name: i.name, unit: i.unit, category: i.category }))
	);
}
