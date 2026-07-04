import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { ingredients } from '../src/lib/data/ingredients';
import { recipes } from '../src/lib/data/recipes';

const url = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
	console.error('Set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
	process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seed() {
	console.log('Seeding ingredients…');
	const { error: ingError } = await supabase.from('ingredients').upsert(
		ingredients.map((i) => ({
			id: i.id,
			name: i.name,
			category: i.category,
			unit: i.unit,
			emoji: i.emoji ?? null
		}))
	);
	if (ingError) throw ingError;

	console.log('Seeding recipes…');
	const { error: recError } = await supabase.from('recipes').upsert(
		recipes.map((r) => ({ id: r.id, data: r }))
	);
	if (recError) throw recError;

	console.log(`Done: ${ingredients.length} ingredients, ${recipes.length} recipes.`);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
