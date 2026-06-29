import type { Recipe } from '$lib/types';

export const recipes: Recipe[] = [
	{
		id: 'overnight-oats',
		title: 'Blueberry Almond Overnight Oats',
		description: 'Creamy oats soaked overnight with blueberries, chia and almonds for a fuss-free morning.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-1',
		prepTime: 10,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 420, protein: 18, carbs: 58, fat: 14, fiber: 11 },
		tags: ['High Fiber', 'No Cook', 'Gut Health'],
		ingredients: [
			{ ingredientId: 'oats', amountPerServing: 60, unit: 'g' },
			{ ingredientId: 'milk', amountPerServing: 180, unit: 'ml' },
			{ ingredientId: 'blueberries', amountPerServing: 50, unit: 'g' },
			{ ingredientId: 'chia-seeds', amountPerServing: 10, unit: 'g' },
			{ ingredientId: 'almonds', amountPerServing: 15, unit: 'g' },
			{ ingredientId: 'honey', amountPerServing: 10, unit: 'g' }
		],
		instructions: [
			'Combine oats, milk and chia seeds in a jar.',
			'Stir well and refrigerate overnight (at least 6 hours).',
			'In the morning, top with blueberries, almonds and a drizzle of honey.',
			'Stir and enjoy cold, or warm gently if preferred.'
		],
		healthBenefits: [
			'Soluble fiber supports healthy digestion',
			'Chia seeds provide plant-based omega-3s',
			'Slow-release carbs for steady morning energy'
		],
		substitutions: [
			{ from: 'Milk', to: 'Coconut milk for a vegan option' },
			{ from: 'Honey', to: 'Maple syrup' }
		],
		mealPrepTips: ['Prepare 3 jars at once', 'Keeps fresh up to 4 days refrigerated'],
		favorite: true
	},
	{
		id: 'avocado-egg-toast',
		title: 'Avocado & Soft Egg Toast',
		description: 'Smashed avocado on whole grain toast with a jammy egg and chili flakes.',
		cuisine: 'Mediterranean',
		mealType: 'breakfast',
		image: 'gradient-2',
		prepTime: 8,
		cookTime: 7,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 380, protein: 17, carbs: 30, fat: 22, fiber: 9 },
		tags: ['Healthy Fats', 'Quick', 'Brain Health'],
		ingredients: [
			{ ingredientId: 'bread', amountPerServing: 2, unit: 'pcs' },
			{ ingredientId: 'avocado', amountPerServing: 1, unit: 'pcs' },
			{ ingredientId: 'eggs', amountPerServing: 2, unit: 'pcs' },
			{ ingredientId: 'lemon', amountPerServing: 0.25, unit: 'pcs' },
			{ ingredientId: 'chili-flakes', amountPerServing: 1, unit: 'g' },
			{ ingredientId: 'salt', amountPerServing: 1, unit: 'g' }
		],
		instructions: [
			'Boil eggs for 6.5 minutes, then cool in cold water and peel.',
			'Toast the bread until golden.',
			'Mash avocado with lemon juice and salt.',
			'Spread on toast, top with halved eggs and chili flakes.'
		],
		healthBenefits: [
			'Monounsaturated fats support heart health',
			'Eggs provide choline for brain function',
			'Whole grains add lasting fiber'
		],
		substitutions: [
			{ from: 'Bread', to: 'Gluten-free sourdough' },
			{ from: 'Eggs', to: 'Pan-fried tofu slices for vegan' }
		],
		mealPrepTips: ['Boil eggs in advance and store up to 5 days']
	},
	{
		id: 'teriyaki-salmon-bowl',
		title: 'Teriyaki Salmon Rice Bowl',
		description: 'Glazed salmon over fluffy rice with steamed broccoli and a sesame-soy finish.',
		cuisine: 'Japanese',
		mealType: 'dinner',
		image: 'gradient-3',
		prepTime: 10,
		cookTime: 20,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 560, protein: 38, carbs: 52, fat: 20, fiber: 6 },
		tags: ['Omega-3', 'High Protein', 'Anti Inflammation'],
		ingredients: [
			{ ingredientId: 'salmon', amountPerServing: 150, unit: 'g' },
			{ ingredientId: 'rice', amountPerServing: 75, unit: 'g' },
			{ ingredientId: 'broccoli', amountPerServing: 120, unit: 'g' },
			{ ingredientId: 'soy-sauce', amountPerServing: 20, unit: 'ml' },
			{ ingredientId: 'honey', amountPerServing: 10, unit: 'g' },
			{ ingredientId: 'garlic', amountPerServing: 1, unit: 'clove' },
			{ ingredientId: 'ginger', amountPerServing: 5, unit: 'g' }
		],
		instructions: [
			'Cook rice according to package directions.',
			'Whisk soy sauce, honey, grated garlic and ginger into a glaze.',
			'Sear salmon 3-4 minutes per side, then brush with glaze.',
			'Steam broccoli until bright green and tender.',
			'Assemble bowls with rice, salmon and broccoli, drizzle remaining glaze.'
		],
		healthBenefits: [
			'Rich in omega-3 fatty acids for heart and brain',
			'High-quality protein supports muscle repair',
			'Broccoli adds sulforaphane antioxidants'
		],
		substitutions: [
			{ from: 'Salmon', to: 'Tofu steaks for a plant-based bowl' },
			{ from: 'Rice', to: 'Quinoa for extra protein' }
		],
		mealPrepTips: ['Cook a big batch of rice for the week', 'Glaze keeps 1 week in the fridge'],
		favorite: true
	},
	{
		id: 'thai-green-curry',
		title: 'Thai Green Chicken Curry',
		description: 'Fragrant coconut curry with chicken, peppers and zucchini over jasmine rice.',
		cuisine: 'Thai',
		mealType: 'dinner',
		image: 'gradient-4',
		prepTime: 15,
		cookTime: 25,
		difficulty: 'Medium',
		baseServings: 3,
		nutrition: { calories: 610, protein: 34, carbs: 48, fat: 28, fiber: 7 },
		tags: ['Comfort', 'Gluten Free', 'Energy'],
		ingredients: [
			{ ingredientId: 'chicken-breast', amountPerServing: 130, unit: 'g' },
			{ ingredientId: 'coconut-milk', amountPerServing: 120, unit: 'ml' },
			{ ingredientId: 'curry-paste', amountPerServing: 20, unit: 'g' },
			{ ingredientId: 'bell-pepper', amountPerServing: 0.5, unit: 'pcs' },
			{ ingredientId: 'zucchini', amountPerServing: 0.5, unit: 'pcs' },
			{ ingredientId: 'rice', amountPerServing: 70, unit: 'g' },
			{ ingredientId: 'garlic', amountPerServing: 1, unit: 'clove' },
			{ ingredientId: 'lime', amountPerServing: 0.25, unit: 'pcs' }
		],
		instructions: [
			'Fry curry paste with garlic until fragrant.',
			'Add sliced chicken and cook until sealed.',
			'Pour in coconut milk and simmer 10 minutes.',
			'Add peppers and zucchini, cook until tender.',
			'Finish with a squeeze of lime and serve over rice.'
		],
		healthBenefits: [
			'Coconut milk provides quick energy MCTs',
			'Colorful vegetables deliver vitamin C',
			'Lean chicken keeps it high in protein'
		],
		substitutions: [
			{ from: 'Chicken', to: 'Chickpeas for a vegan curry' },
			{ from: 'Curry paste', to: 'Red curry paste for a milder kick' }
		],
		mealPrepTips: ['Tastes even better the next day', 'Freezes well for up to 1 month']
	},
	{
		id: 'mediterranean-bowl',
		title: 'Mediterranean Chickpea Bowl',
		description: 'Quinoa, roasted chickpeas, cucumber and feta with a lemon-olive oil dressing.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-5',
		prepTime: 15,
		cookTime: 20,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 480, protein: 19, carbs: 56, fat: 20, fiber: 12 },
		tags: ['Plant Based', 'High Fiber', 'Longevity'],
		ingredients: [
			{ ingredientId: 'quinoa', amountPerServing: 70, unit: 'g' },
			{ ingredientId: 'chickpeas', amountPerServing: 120, unit: 'g' },
			{ ingredientId: 'cucumber', amountPerServing: 0.5, unit: 'pcs' },
			{ ingredientId: 'tomato', amountPerServing: 1, unit: 'pcs' },
			{ ingredientId: 'cheese', amountPerServing: 30, unit: 'g' },
			{ ingredientId: 'olive-oil', amountPerServing: 15, unit: 'ml' },
			{ ingredientId: 'lemon', amountPerServing: 0.5, unit: 'pcs' }
		],
		instructions: [
			'Cook quinoa and let cool slightly.',
			'Roast chickpeas with paprika until crisp.',
			'Dice cucumber and tomato.',
			'Whisk olive oil with lemon juice and salt.',
			'Combine everything, top with crumbled feta and dressing.'
		],
		healthBenefits: [
			'Plant protein and fiber for satiety',
			'Olive oil supports longevity and heart health',
			'Quinoa is a complete protein source'
		],
		substitutions: [
			{ from: 'Cheese', to: 'Omit for vegan, add olives' },
			{ from: 'Quinoa', to: 'Brown rice' }
		],
		mealPrepTips: ['Keep dressing separate until serving', 'Great cold for packed lunches'],
		favorite: true
	},
	{
		id: 'turkey-lettuce-wraps',
		title: 'Ginger Turkey Lettuce Wraps',
		description: 'Savory ground turkey with ginger and garlic spooned into crisp lettuce cups.',
		cuisine: 'Chinese',
		mealType: 'lunch',
		image: 'gradient-6',
		prepTime: 12,
		cookTime: 15,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 360, protein: 32, carbs: 18, fat: 16, fiber: 4 },
		tags: ['Low Carb', 'High Protein', 'Fat Loss'],
		ingredients: [
			{ ingredientId: 'turkey', amountPerServing: 140, unit: 'g' },
			{ ingredientId: 'garlic', amountPerServing: 2, unit: 'clove' },
			{ ingredientId: 'ginger', amountPerServing: 8, unit: 'g' },
			{ ingredientId: 'soy-sauce', amountPerServing: 15, unit: 'ml' },
			{ ingredientId: 'carrot', amountPerServing: 60, unit: 'g' },
			{ ingredientId: 'kale', amountPerServing: 40, unit: 'g' }
		],
		instructions: [
			'Brown turkey in a hot pan, breaking it apart.',
			'Add garlic and ginger, cook until fragrant.',
			'Stir in grated carrot and soy sauce.',
			'Spoon into lettuce or kale leaves and serve.'
		],
		healthBenefits: [
			'Lean protein supports fat loss goals',
			'Ginger aids digestion and reduces inflammation',
			'Low in carbs and calorie dense'
		],
		substitutions: [
			{ from: 'Turkey', to: 'Crumbled tofu or tempeh' },
			{ from: 'Soy sauce', to: 'Coconut aminos for soy-free' }
		],
		mealPrepTips: ['Cook the filling ahead', 'Assemble wraps fresh to keep them crisp']
	},
	{
		id: 'veggie-stir-fry',
		title: 'Rainbow Tofu Stir-Fry',
		description: 'Crispy tofu and colorful vegetables tossed in a light ginger-soy sauce.',
		cuisine: 'Chinese',
		mealType: 'dinner',
		image: 'gradient-7',
		prepTime: 15,
		cookTime: 15,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 430, protein: 24, carbs: 40, fat: 18, fiber: 8 },
		tags: ['Vegan', 'Gut Health', 'Quick'],
		ingredients: [
			{ ingredientId: 'tofu', amountPerServing: 150, unit: 'g' },
			{ ingredientId: 'bell-pepper', amountPerServing: 0.5, unit: 'pcs' },
			{ ingredientId: 'broccoli', amountPerServing: 100, unit: 'g' },
			{ ingredientId: 'carrot', amountPerServing: 50, unit: 'g' },
			{ ingredientId: 'soy-sauce', amountPerServing: 20, unit: 'ml' },
			{ ingredientId: 'garlic', amountPerServing: 2, unit: 'clove' },
			{ ingredientId: 'rice', amountPerServing: 70, unit: 'g' }
		],
		instructions: [
			'Press and cube tofu, then pan-fry until golden.',
			'Stir-fry garlic, peppers, broccoli and carrot on high heat.',
			'Return tofu and add soy sauce.',
			'Toss for 2 minutes and serve over rice.'
		],
		healthBenefits: [
			'Plant protein with all essential amino acids',
			'Wide range of antioxidants from colorful veg',
			'Supports a healthy gut microbiome'
		],
		substitutions: [
			{ from: 'Tofu', to: 'Tempeh or edamame' },
			{ from: 'Rice', to: 'Cauliflower rice for low carb' }
		],
		mealPrepTips: ['Chop vegetables in advance', 'Use a very hot pan for the best sear']
	},
	{
		id: 'lentil-soup',
		title: 'Golden Lentil & Turmeric Soup',
		description: 'A warming, anti-inflammatory lentil soup with turmeric, ginger and lemon.',
		cuisine: 'Indian',
		mealType: 'lunch',
		image: 'gradient-8',
		prepTime: 10,
		cookTime: 30,
		difficulty: 'Easy',
		baseServings: 4,
		nutrition: { calories: 320, protein: 18, carbs: 44, fat: 8, fiber: 14 },
		tags: ['Anti Inflammation', 'Plant Based', 'High Fiber'],
		ingredients: [
			{ ingredientId: 'lentils', amountPerServing: 80, unit: 'g' },
			{ ingredientId: 'carrot', amountPerServing: 50, unit: 'g' },
			{ ingredientId: 'onion', amountPerServing: 0.25, unit: 'pcs' },
			{ ingredientId: 'turmeric', amountPerServing: 2, unit: 'g' },
			{ ingredientId: 'ginger', amountPerServing: 5, unit: 'g' },
			{ ingredientId: 'coconut-milk', amountPerServing: 60, unit: 'ml' },
			{ ingredientId: 'lemon', amountPerServing: 0.25, unit: 'pcs' }
		],
		instructions: [
			'Sauté onion, carrot and ginger until soft.',
			'Add turmeric and stir for 30 seconds.',
			'Add lentils and water, simmer 25 minutes.',
			'Stir in coconut milk and finish with lemon juice.'
		],
		healthBenefits: [
			'Turmeric curcumin reduces inflammation',
			'Lentils are rich in iron and fiber',
			'Naturally low in fat and filling'
		],
		substitutions: [
			{ from: 'Coconut milk', to: 'Greek yogurt swirl' },
			{ from: 'Lentils', to: 'Split peas' }
		],
		mealPrepTips: ['Batch cook and freeze portions', 'Thickens as it sits, add water to reheat'],
		favorite: true
	},
	{
		id: 'greek-yogurt-parfait',
		title: 'Berry Greek Yogurt Parfait',
		description: 'Layers of creamy Greek yogurt, berries, oats and honey for a protein-rich snack.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-9',
		prepTime: 5,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 240, protein: 20, carbs: 28, fat: 6, fiber: 5 },
		tags: ['High Protein', 'No Cook', 'Gut Health'],
		ingredients: [
			{ ingredientId: 'greek-yogurt', amountPerServing: 150, unit: 'g' },
			{ ingredientId: 'strawberries', amountPerServing: 60, unit: 'g' },
			{ ingredientId: 'blueberries', amountPerServing: 30, unit: 'g' },
			{ ingredientId: 'oats', amountPerServing: 20, unit: 'g' },
			{ ingredientId: 'honey', amountPerServing: 8, unit: 'g' }
		],
		instructions: [
			'Spoon half the yogurt into a glass.',
			'Add a layer of berries and oats.',
			'Repeat layers and finish with honey.',
			'Serve immediately or chill until needed.'
		],
		healthBenefits: [
			'Probiotics from yogurt support gut health',
			'Berries are packed with antioxidants',
			'High protein keeps you full between meals'
		],
		substitutions: [
			{ from: 'Greek yogurt', to: 'Coconut yogurt for dairy-free' },
			{ from: 'Honey', to: 'Fresh fruit only for less sugar' }
		],
		mealPrepTips: ['Layer in jars for grab-and-go snacks']
	},
	{
		id: 'energy-bites',
		title: 'Peanut Butter Oat Energy Bites',
		description: 'No-bake bites of oats, peanut butter, honey and chia for a quick energy boost.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-10',
		prepTime: 12,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 4,
		nutrition: { calories: 190, protein: 7, carbs: 22, fat: 9, fiber: 4 },
		tags: ['Energy', 'No Cook', 'Pre-Workout'],
		ingredients: [
			{ ingredientId: 'oats', amountPerServing: 30, unit: 'g' },
			{ ingredientId: 'peanut-butter', amountPerServing: 20, unit: 'g' },
			{ ingredientId: 'honey', amountPerServing: 12, unit: 'g' },
			{ ingredientId: 'chia-seeds', amountPerServing: 5, unit: 'g' },
			{ ingredientId: 'cinnamon', amountPerServing: 1, unit: 'g' }
		],
		instructions: [
			'Mix all ingredients in a bowl until combined.',
			'Chill the mixture for 15 minutes.',
			'Roll into small bite-sized balls.',
			'Store refrigerated and enjoy as needed.'
		],
		healthBenefits: [
			'Balanced carbs and fat for sustained energy',
			'Chia adds omega-3 and fiber',
			'Great natural pre-workout fuel'
		],
		substitutions: [
			{ from: 'Peanut butter', to: 'Almond butter for nut variety' },
			{ from: 'Honey', to: 'Date syrup for vegan' }
		],
		mealPrepTips: ['Makes about 12 bites', 'Keeps 1 week refrigerated or freeze for longer']
	}
];

export const recipeMap: Record<string, Recipe> = Object.fromEntries(
	recipes.map((r) => [r.id, r])
);

export function getRecipe(id: string): Recipe | undefined {
	return recipeMap[id];
}
