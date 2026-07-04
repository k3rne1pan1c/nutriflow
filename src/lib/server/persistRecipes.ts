import type { SupabaseClient } from '@supabase/supabase-js';
import type { Recipe } from '$lib/types';

/** Persist AI-generated recipes and link them to the user. */
export async function persistGeneratedRecipes(
	supabase: SupabaseClient,
	recipes: Recipe[],
	userId?: string
): Promise<void> {
	const generated = recipes.filter((r) => r.id.startsWith('ai-'));
	if (generated.length === 0) return;

	const { error } = await supabase.from('recipes').upsert(
		generated.map((r) => ({ id: r.id, data: r })),
		{ onConflict: 'id' }
	);
	if (error) throw error;

	if (userId) {
		const { error: linkError } = await supabase.from('user_recipes').upsert(
			generated.map((r) => ({
				user_id: userId,
				recipe_id: r.id,
				source: 'ai' as const
			})),
			{ onConflict: 'user_id,recipe_id' }
		);
		if (linkError) throw linkError;
	}
}
