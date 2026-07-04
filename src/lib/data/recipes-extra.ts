// SEED SOURCE ONLY — additional catalog recipes.
import { defineRecipe } from './recipeBuilder';

const g = (ingredientId: string, amountPerServing: number, unit: RecipeIngredient['unit'] = 'g') =>
	({ ingredientId, amountPerServing, unit });

type RecipeIngredient = import('$lib/types').RecipeIngredient;

export const extraRecipes = [
	// ── BREAKFAST (10) ──
	defineRecipe({
		id: 'banana-pancakes',
		title: 'Banana Oat Pancakes',
		description: 'Fluffy oat pancakes with mashed banana and cinnamon.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-11',
		prepTime: 10,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 340, protein: 12, carbs: 52, fat: 10, fiber: 7 },
		tags: ['High Fiber', 'Energy', 'Kid Friendly'],
		ingredients: [
			g('oats', 50),
			g('banana', 1, 'pcs'),
			g('eggs', 1, 'pcs'),
			g('milk', 80, 'ml'),
			g('cinnamon', 2),
			g('honey', 10)
		],
		instructions: [
			'Blend oats, banana, egg and milk until smooth.',
			'Stir in cinnamon.',
			'Cook small pancakes in a non-stick pan 2–3 min per side.',
			'Drizzle with honey and serve.'
		],
		healthBenefits: ['Oats provide soluble fiber', 'Banana adds potassium']
	}),
	defineRecipe({
		id: 'scrambled-eggs-spinach',
		title: 'Spinach & Feta Scramble',
		description: 'Soft scrambled eggs with wilted spinach and crumbled feta.',
		cuisine: 'Mediterranean',
		mealType: 'breakfast',
		image: 'gradient-12',
		prepTime: 5,
		cookTime: 8,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 320, protein: 22, carbs: 6, fat: 24, fiber: 3 },
		tags: ['High Protein', 'Quick', 'Low Carb'],
		ingredients: [
			g('eggs', 3, 'pcs'),
			g('spinach', 60),
			g('cheese', 25),
			g('olive-oil', 5, 'ml'),
			g('salt', 1)
		],
		instructions: [
			'Sauté spinach in olive oil until wilted.',
			'Whisk eggs with salt and pour over spinach.',
			'Stir gently until just set.',
			'Top with crumbled feta.'
		]
	}),
	defineRecipe({
		id: 'smoothie-bowl',
		title: 'Berry Protein Smoothie Bowl',
		description: 'Thick smoothie bowl topped with granola-style oats and seeds.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-13',
		prepTime: 8,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 390, protein: 24, carbs: 48, fat: 12, fiber: 9 },
		tags: ['High Protein', 'No Cook', 'Antioxidants'],
		ingredients: [
			g('greek-yogurt', 180),
			g('banana', 1, 'pcs'),
			g('blueberries', 60),
			g('strawberries', 40),
			g('oats', 25),
			g('chia-seeds', 8),
			g('almonds', 12)
		],
		instructions: [
			'Blend yogurt, half the banana and berries until thick.',
			'Pour into a bowl.',
			'Top with remaining fruit, oats, chia and almonds.'
		]
	}),
	defineRecipe({
		id: 'shakshuka',
		title: 'Quick Shakshuka',
		description: 'Eggs poached in spiced tomato sauce with peppers.',
		cuisine: 'Mediterranean',
		mealType: 'breakfast',
		image: 'gradient-14',
		prepTime: 10,
		cookTime: 15,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 280, protein: 16, carbs: 18, fat: 16, fiber: 5 },
		tags: ['High Protein', 'Comfort', 'One Pan'],
		ingredients: [
			g('eggs', 2, 'pcs'),
			g('tomato', 2, 'pcs'),
			g('bell-pepper', 0.5, 'pcs'),
			g('onion', 0.25, 'pcs'),
			g('garlic', 1, 'clove'),
			g('paprika', 2),
			g('olive-oil', 10, 'ml')
		],
		instructions: [
			'Sauté onion, pepper and garlic in olive oil.',
			'Add chopped tomatoes and paprika, simmer 8 min.',
			'Make wells and crack in eggs.',
			'Cover and cook until whites are set.'
		]
	}),
	defineRecipe({
		id: 'chia-pudding',
		title: 'Vanilla Chia Pudding',
		description: 'Creamy overnight chia pudding with mango and coconut.',
		cuisine: 'Thai',
		mealType: 'breakfast',
		image: 'gradient-15',
		prepTime: 8,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 310, protein: 10, carbs: 32, fat: 16, fiber: 12 },
		tags: ['Vegan', 'No Cook', 'Gut Health'],
		ingredients: [
			g('chia-seeds', 30),
			g('coconut-milk', 200, 'ml'),
			g('honey', 8),
			g('cinnamon', 1),
			g('banana', 0.5, 'pcs')
		],
		instructions: [
			'Mix chia seeds, coconut milk, honey and cinnamon.',
			'Refrigerate at least 4 hours.',
			'Top with sliced banana before serving.'
		]
	}),
	defineRecipe({
		id: 'german-muesli',
		title: 'Apple Cinnamon Muesli',
		description: 'Classic soaked muesli with grated apple and yogurt.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-16',
		prepTime: 8,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 400, protein: 16, carbs: 58, fat: 12, fiber: 10 },
		tags: ['High Fiber', 'No Cook', 'German'],
		ingredients: [
			g('oats', 55),
			g('greek-yogurt', 120),
			g('milk', 100, 'ml'),
			g('apple', 1, 'pcs'),
			g('cinnamon', 2),
			g('almonds', 15)
		],
		instructions: [
			'Combine oats, yogurt and milk.',
			'Grate apple and stir in with cinnamon.',
			'Refrigerate 30 min or overnight.',
			'Top with almonds.'
		]
	}),
	defineRecipe({
		id: 'breakfast-burrito',
		title: 'Black Bean Breakfast Burrito',
		description: 'Whole wheat wrap with scrambled eggs, beans and salsa.',
		cuisine: 'Mexican',
		mealType: 'breakfast',
		image: 'gradient-17',
		prepTime: 10,
		cookTime: 10,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 450, protein: 24, carbs: 48, fat: 18, fiber: 11 },
		tags: ['High Protein', 'Energy', 'Fiber'],
		ingredients: [
			g('tortilla', 1, 'pcs'),
			g('eggs', 2, 'pcs'),
			g('black-beans', 80),
			g('bell-pepper', 0.25, 'pcs'),
			g('cheese', 20),
			g('tomato', 0.5, 'pcs')
		],
		instructions: [
			'Scramble eggs with diced pepper.',
			'Warm beans and tortilla.',
			'Fill wrap with eggs, beans, cheese and tomato.',
			'Roll tightly and serve.'
		]
	}),
	defineRecipe({
		id: 'smoked-salmon-bagel',
		title: 'Smoked Salmon & Cucumber Toast',
		description: 'Whole grain toast with cream cheese, salmon and fresh herbs.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-18',
		prepTime: 8,
		cookTime: 3,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 360, protein: 26, carbs: 28, fat: 16, fiber: 5 },
		tags: ['Omega-3', 'High Protein', 'Quick'],
		ingredients: [
			g('bread', 2, 'pcs'),
			g('salmon', 80),
			g('cucumber', 0.25, 'pcs'),
			g('cheese', 25),
			g('lemon', 0.25, 'pcs')
		],
		instructions: [
			'Toast bread until golden.',
			'Spread with soft cheese.',
			'Layer salmon and thin cucumber slices.',
			'Squeeze lemon over the top.'
		]
	}),
	defineRecipe({
		id: 'quinoa-breakfast-bowl',
		title: 'Warm Quinoa Breakfast Bowl',
		description: 'Cinnamon-spiced quinoa with nuts, berries and a touch of honey.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-19',
		prepTime: 5,
		cookTime: 15,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 350, protein: 12, carbs: 54, fat: 10, fiber: 8 },
		tags: ['Plant Based', 'High Fiber', 'Gluten Free'],
		ingredients: [
			g('quinoa', 70),
			g('milk', 200, 'ml'),
			g('blueberries', 50),
			g('almonds', 20),
			g('cinnamon', 2),
			g('honey', 12)
		],
		instructions: [
			'Cook quinoa in milk with cinnamon until tender.',
			'Divide into bowls.',
			'Top with berries, almonds and honey.'
		]
	}),
	defineRecipe({
		id: 'tofu-scramble',
		title: 'Turmeric Tofu Scramble',
		description: 'Crumbled tofu with turmeric, kale and cherry tomatoes.',
		cuisine: 'German',
		mealType: 'breakfast',
		image: 'gradient-20',
		prepTime: 8,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 260, protein: 20, carbs: 12, fat: 16, fiber: 5 },
		tags: ['Vegan', 'High Protein', 'Anti Inflammation'],
		ingredients: [
			g('tofu', 200),
			g('kale', 50),
			g('tomato', 1, 'pcs'),
			g('turmeric', 2),
			g('olive-oil', 10, 'ml'),
			g('salt', 1)
		],
		instructions: [
			'Crumble tofu and sauté in olive oil.',
			'Add turmeric and salt, cook 5 min.',
			'Fold in kale and diced tomato until wilted.',
			'Serve warm.'
		]
	}),

	// ── LUNCH (10) ──
	defineRecipe({
		id: 'chicken-caesar-salad',
		title: 'Grilled Chicken Caesar Salad',
		description: 'Romaine-style salad with grilled chicken, parmesan and light dressing.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-21',
		prepTime: 12,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 420, protein: 38, carbs: 14, fat: 24, fiber: 4 },
		tags: ['High Protein', 'Low Carb', 'Quick'],
		ingredients: [
			g('chicken-breast', 150),
			g('kale', 80),
			g('cheese', 25),
			g('olive-oil', 15, 'ml'),
			g('lemon', 0.5, 'pcs'),
			g('garlic', 1, 'clove')
		],
		instructions: [
			'Season and grill chicken until cooked through.',
			'Massage kale with olive oil, lemon and garlic.',
			'Slice chicken and toss with kale and parmesan.',
			'Serve immediately.'
		]
	}),
	defineRecipe({
		id: 'tuna-quinoa-salad',
		title: 'Tuna & Quinoa Power Salad',
		description: 'Protein-packed quinoa salad with tuna, cucumber and lemon.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-22',
		prepTime: 12,
		cookTime: 15,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 390, protein: 32, carbs: 38, fat: 12, fiber: 6 },
		tags: ['High Protein', 'Omega-3', 'Meal Prep'],
		ingredients: [
			g('quinoa', 70),
			g('salmon', 100),
			g('cucumber', 0.5, 'pcs'),
			g('tomato', 1, 'pcs'),
			g('olive-oil', 12, 'ml'),
			g('lemon', 0.5, 'pcs')
		],
		instructions: [
			'Cook quinoa and cool.',
			'Flake cooked salmon (or use canned tuna substitute).',
			'Dice cucumber and tomato.',
			'Toss everything with olive oil and lemon.'
		]
	}),
	defineRecipe({
		id: 'sweet-potato-buddha-bowl',
		title: 'Roasted Sweet Potato Buddha Bowl',
		description: 'Roasted sweet potato, chickpeas and tahini drizzle over greens.',
		cuisine: 'German',
		mealType: 'lunch',
		image: 'gradient-23',
		prepTime: 12,
		cookTime: 25,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 440, protein: 14, carbs: 58, fat: 18, fiber: 13 },
		tags: ['Plant Based', 'High Fiber', 'Meal Prep'],
		ingredients: [
			g('sweet-potato', 200),
			g('chickpeas', 120),
			g('spinach', 60),
			g('olive-oil', 15, 'ml'),
			g('paprika', 2),
			g('lemon', 0.5, 'pcs')
		],
		instructions: [
			'Roast cubed sweet potato and chickpeas with paprika.',
			'Arrange spinach in bowls.',
			'Top with roasted veg and drizzle olive oil and lemon.'
		]
	}),
	defineRecipe({
		id: 'minestrone-soup',
		title: 'Hearty Vegetable Minestrone',
		description: 'Italian-style vegetable soup with beans and pasta.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-24',
		prepTime: 12,
		cookTime: 28,
		difficulty: 'Easy',
		baseServings: 4,
		nutrition: { calories: 290, protein: 12, carbs: 46, fat: 6, fiber: 10 },
		tags: ['Plant Based', 'Comfort', 'High Fiber'],
		ingredients: [
			g('pasta', 60),
			g('chickpeas', 80),
			g('carrot', 60),
			g('tomato', 2, 'pcs'),
			g('onion', 0.5, 'pcs'),
			g('garlic', 2, 'clove'),
			g('olive-oil', 10, 'ml')
		],
		instructions: [
			'Sauté onion, carrot and garlic.',
			'Add tomatoes, chickpeas and water, simmer 15 min.',
			'Add pasta and cook until tender.',
			'Finish with olive oil.'
		]
	}),
	defineRecipe({
		id: 'shrimp-garlic-pasta',
		title: 'Garlic Shrimp Pasta',
		description: 'Linguine-style pasta with garlic butter shrimp and parsley.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-25',
		prepTime: 10,
		cookTime: 15,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 520, protein: 32, carbs: 54, fat: 18, fiber: 4 },
		tags: ['High Protein', 'Quick', 'Comfort'],
		ingredients: [
			g('pasta', 100),
			g('shrimp', 180),
			g('garlic', 3, 'clove'),
			g('butter', 15),
			g('lemon', 0.5, 'pcs'),
			g('olive-oil', 10, 'ml')
		],
		instructions: [
			'Cook pasta until al dente.',
			'Sauté shrimp with garlic in butter and olive oil.',
			'Toss pasta with shrimp and lemon juice.',
			'Serve immediately.'
		]
	}),
	defineRecipe({
		id: 'falafel-wrap',
		title: 'Falafel Hummus Wrap',
		description: 'Crispy chickpea falafel in a wrap with hummus and fresh veg.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-26',
		prepTime: 15,
		cookTime: 15,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 460, protein: 16, carbs: 58, fat: 20, fiber: 12 },
		tags: ['Vegan', 'Plant Based', 'Fiber'],
		ingredients: [
			g('chickpeas', 150),
			g('tortilla', 2, 'pcs'),
			g('cucumber', 0.5, 'pcs'),
			g('tomato', 1, 'pcs'),
			g('garlic', 2, 'clove'),
			g('cumin', 2),
			g('olive-oil', 15, 'ml')
		],
		instructions: [
			'Mash chickpeas with garlic, cumin and form patties.',
			'Pan-fry patties in olive oil until crisp.',
			'Fill tortillas with falafel, cucumber and tomato.',
			'Roll and serve.'
		]
	}),
	defineRecipe({
		id: 'beef-stir-fry-lunch',
		title: 'Ginger Beef & Broccoli',
		description: 'Quick stir-fried beef with broccoli in a ginger-soy sauce.',
		cuisine: 'Chinese',
		mealType: 'lunch',
		image: 'gradient-27',
		prepTime: 12,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 410, protein: 34, carbs: 22, fat: 20, fiber: 5 },
		tags: ['High Protein', 'Iron', 'Quick'],
		ingredients: [
			g('ground-beef', 160),
			g('broccoli', 150),
			g('ginger', 8),
			g('soy-sauce', 20, 'ml'),
			g('garlic', 2, 'clove'),
			g('rice', 70)
		],
		instructions: [
			'Cook rice.',
			'Stir-fry beef until browned.',
			'Add broccoli, ginger, garlic and soy sauce.',
			'Serve over rice.'
		]
	}),
	defineRecipe({
		id: 'caprese-sandwich',
		title: 'Caprese Grilled Sandwich',
		description: 'Toasted sandwich with tomato, mozzarella and basil pesto notes.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-28',
		prepTime: 8,
		cookTime: 8,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 380, protein: 18, carbs: 36, fat: 18, fiber: 4 },
		tags: ['Quick', 'Comfort', 'Vegetarian'],
		ingredients: [
			g('bread', 2, 'pcs'),
			g('tomato', 1, 'pcs'),
			g('cheese', 40),
			g('olive-oil', 8, 'ml'),
			g('spinach', 10)
		],
		instructions: [
			'Layer tomato and cheese between bread slices.',
			'Brush with olive oil.',
			'Grill in a pan until cheese melts.',
			'Serve warm.'
		]
	}),
	defineRecipe({
		id: 'mushroom-risotto',
		title: 'Creamy Mushroom Risotto',
		description: 'Arborio-style rice with sautéed mushrooms and parmesan.',
		cuisine: 'Mediterranean',
		mealType: 'lunch',
		image: 'gradient-29',
		prepTime: 10,
		cookTime: 28,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 480, protein: 14, carbs: 62, fat: 18, fiber: 4 },
		tags: ['Comfort', 'Vegetarian', 'Umami'],
		ingredients: [
			g('rice', 90),
			g('mushroom', 150),
			g('onion', 0.25, 'pcs'),
			g('cheese', 30),
			g('butter', 12),
			g('garlic', 1, 'clove')
		],
		instructions: [
			'Sauté mushrooms, onion and garlic.',
			'Add rice and cook, adding water gradually.',
			'Stir until creamy, finish with butter and cheese.'
		]
	}),
	defineRecipe({
		id: 'asian-noodle-salad',
		title: 'Cold Sesame Noodle Salad',
		description: 'Chilled noodles with crunchy vegetables and sesame-soy dressing.',
		cuisine: 'Chinese',
		mealType: 'lunch',
		image: 'gradient-30',
		prepTime: 15,
		cookTime: 8,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 400, protein: 12, carbs: 58, fat: 14, fiber: 6 },
		tags: ['Vegan', 'Meal Prep', 'Quick'],
		ingredients: [
			g('pasta', 90),
			g('carrot', 60),
			g('cucumber', 0.5, 'pcs'),
			g('soy-sauce', 20, 'ml'),
			g('peanut-butter', 15),
			g('ginger', 5),
			g('lime', 0.5, 'pcs')
		],
		instructions: [
			'Cook and cool pasta.',
			'Julienne carrot and cucumber.',
			'Whisk soy sauce, peanut butter, ginger and lime.',
			'Toss noodles with veg and dressing.'
		]
	}),

	// ── DINNER (10) ──
	defineRecipe({
		id: 'baked-chicken-thighs',
		title: 'Herb Baked Chicken & Vegetables',
		description: 'One-tray roasted chicken thighs with root vegetables.',
		cuisine: 'German',
		mealType: 'dinner',
		image: 'gradient-31',
		prepTime: 12,
		cookTime: 35,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 480, protein: 36, carbs: 28, fat: 26, fiber: 5 },
		tags: ['High Protein', 'One Pan', 'Comfort'],
		ingredients: [
			g('chicken-breast', 150),
			g('sweet-potato', 150),
			g('carrot', 80),
			g('onion', 0.5, 'pcs'),
			g('olive-oil', 15, 'ml'),
			g('paprika', 2),
			g('garlic', 2, 'clove')
		],
		instructions: [
			'Toss vegetables with olive oil, paprika and garlic.',
			'Nestle chicken on the tray.',
			'Roast at 200°C for 30–35 min until cooked through.'
		]
	}),
	defineRecipe({
		id: 'beef-tacos',
		title: 'Lean Beef Taco Bowl',
		description: 'Seasoned ground beef over rice with fresh salsa and avocado.',
		cuisine: 'Mexican',
		mealType: 'dinner',
		image: 'gradient-32',
		prepTime: 12,
		cookTime: 15,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 540, protein: 32, carbs: 48, fat: 24, fiber: 8 },
		tags: ['High Protein', 'Iron', 'Family Friendly'],
		ingredients: [
			g('ground-beef', 180),
			g('rice', 75),
			g('black-beans', 80),
			g('tomato', 1, 'pcs'),
			g('avocado', 0.5, 'pcs'),
			g('cumin', 2),
			g('lime', 0.5, 'pcs')
		],
		instructions: [
			'Cook rice and warm beans.',
			'Brown beef with cumin.',
			'Assemble bowls with rice, beef, beans, salsa and avocado.',
			'Squeeze lime over the top.'
		]
	}),
	defineRecipe({
		id: 'fish-tacos',
		title: 'Crispy Fish Tacos',
		description: 'Pan-seared white fish in tortillas with cabbage slaw and lime.',
		cuisine: 'Mexican',
		mealType: 'dinner',
		image: 'gradient-33',
		prepTime: 12,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 420, protein: 28, carbs: 38, fat: 16, fiber: 6 },
		tags: ['Omega-3', 'Quick', 'Pescatarian'],
		ingredients: [
			g('salmon', 160),
			g('tortilla', 3, 'pcs'),
			g('kale', 60),
			g('lime', 1, 'pcs'),
			g('avocado', 0.5, 'pcs')
		],
		instructions: [
			'Season and pan-sear salmon, then flake.',
			'Warm tortillas.',
			'Toss shredded cabbage with lime juice.',
			'Fill tortillas with fish, slaw and avocado.'
		]
	}),
	defineRecipe({
		id: 'lentil-bolognese',
		title: 'Lentil Bolognese Pasta',
		description: 'Rich tomato lentil sauce over whole wheat pasta.',
		cuisine: 'Mediterranean',
		mealType: 'dinner',
		image: 'gradient-34',
		prepTime: 12,
		cookTime: 30,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 490, protein: 22, carbs: 72, fat: 12, fiber: 14 },
		tags: ['Plant Based', 'Iron', 'High Fiber'],
		ingredients: [
			g('lentils', 90),
			g('pasta', 90),
			g('tomato', 2, 'pcs'),
			g('onion', 0.5, 'pcs'),
			g('carrot', 50),
			g('garlic', 2, 'clove'),
			g('olive-oil', 12, 'ml')
		],
		instructions: [
			'Sauté onion, carrot and garlic.',
			'Add lentils, tomatoes and water, simmer 25 min.',
			'Cook pasta and toss with sauce.'
		]
	}),
	defineRecipe({
		id: 'chicken-curry-simple',
		title: 'Mild Coconut Chicken Curry',
		description: 'Creamy coconut curry with tender chicken and spinach.',
		cuisine: 'Indian',
		mealType: 'dinner',
		image: 'gradient-35',
		prepTime: 12,
		cookTime: 25,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 450, protein: 32, carbs: 22, fat: 26, fiber: 4 },
		tags: ['High Protein', 'Comfort', 'Gluten Free'],
		ingredients: [
			g('chicken-breast', 140),
			g('coconut-milk', 150, 'ml'),
			g('spinach', 80),
			g('onion', 0.5, 'pcs'),
			g('curry-paste', 18),
			g('rice', 70)
		],
		instructions: [
			'Cook rice.',
			'Sauté onion and curry paste.',
			'Add chicken and coconut milk, simmer 15 min.',
			'Stir in spinach and serve over rice.'
		]
	}),
	defineRecipe({
		id: 'stuffed-bell-peppers',
		title: 'Quinoa Stuffed Bell Peppers',
		description: 'Roasted peppers filled with quinoa, black beans and cheese.',
		cuisine: 'Mexican',
		mealType: 'dinner',
		image: 'gradient-36',
		prepTime: 15,
		cookTime: 30,
		difficulty: 'Medium',
		baseServings: 2,
		nutrition: { calories: 380, protein: 16, carbs: 48, fat: 14, fiber: 10 },
		tags: ['Vegetarian', 'High Fiber', 'Meal Prep'],
		ingredients: [
			g('bell-pepper', 2, 'pcs'),
			g('quinoa', 70),
			g('black-beans', 100),
			g('tomato', 1, 'pcs'),
			g('cheese', 35),
			g('cumin', 2)
		],
		instructions: [
			'Cook quinoa and mix with beans, tomato and cumin.',
			'Halve peppers and fill with mixture.',
			'Top with cheese and bake 25 min at 190°C.'
		]
	}),
	defineRecipe({
		id: 'pork-stir-fry',
		title: 'Five-Spice Pork & Veg Stir-Fry',
		description: 'Quick pork strips with mushrooms and peppers over noodles.',
		cuisine: 'Chinese',
		mealType: 'dinner',
		image: 'gradient-37',
		prepTime: 12,
		cookTime: 12,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 460, protein: 30, carbs: 42, fat: 18, fiber: 5 },
		tags: ['High Protein', 'Quick', 'Umami'],
		ingredients: [
			g('ground-beef', 150),
			g('mushroom', 100),
			g('bell-pepper', 0.5, 'pcs'),
			g('soy-sauce', 20, 'ml'),
			g('ginger', 6),
			g('pasta', 80)
		],
		instructions: [
			'Cook noodles.',
			'Stir-fry beef, mushrooms and pepper on high heat.',
			'Add ginger and soy sauce.',
			'Toss with noodles and serve.'
		]
	}),
	defineRecipe({
		id: 'baked-cod-vegetables',
		title: 'Lemon Herb Baked Cod',
		description: 'Flaky white fish baked with cherry tomatoes and zucchini.',
		cuisine: 'Mediterranean',
		mealType: 'dinner',
		image: 'gradient-38',
		prepTime: 10,
		cookTime: 18,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 320, protein: 34, carbs: 12, fat: 14, fiber: 4 },
		tags: ['Low Carb', 'Lean Protein', 'Pescatarian'],
		ingredients: [
			g('salmon', 140),
			g('zucchini', 1, 'pcs'),
			g('tomato', 2, 'pcs'),
			g('lemon', 0.5, 'pcs'),
			g('olive-oil', 12, 'ml'),
			g('garlic', 2, 'clove')
		],
		instructions: [
			'Arrange fish and vegetables in a baking dish.',
			'Drizzle with olive oil, garlic and lemon.',
			'Bake at 190°C for 15–18 min until fish flakes.'
		]
	}),
	defineRecipe({
		id: 'chickpea-coconut-stew',
		title: 'Chickpea Coconut Stew',
		description: 'Hearty vegan stew with chickpeas, sweet potato and spinach.',
		cuisine: 'Indian',
		mealType: 'dinner',
		image: 'gradient-39',
		prepTime: 12,
		cookTime: 28,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 390, protein: 14, carbs: 52, fat: 14, fiber: 12 },
		tags: ['Vegan', 'High Fiber', 'Comfort'],
		ingredients: [
			g('chickpeas', 150),
			g('sweet-potato', 150),
			g('spinach', 60),
			g('coconut-milk', 120, 'ml'),
			g('onion', 0.5, 'pcs'),
			g('curry-paste', 15),
			g('rice', 60)
		],
		instructions: [
			'Sauté onion and curry paste.',
			'Add chickpeas, sweet potato, coconut milk and simmer.',
			'Stir in spinach and serve with rice.'
		]
	}),
	defineRecipe({
		id: 'sheet-pan-sausage',
		title: 'Sheet Pan Sausage & Veg',
		description: 'Roasted sausages with peppers, onions and potatoes.',
		cuisine: 'German',
		mealType: 'dinner',
		image: 'gradient-40',
		prepTime: 10,
		cookTime: 30,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 520, protein: 24, carbs: 38, fat: 30, fiber: 6 },
		tags: ['One Pan', 'Family Friendly', 'Comfort'],
		ingredients: [
			g('ground-beef', 120),
			g('sweet-potato', 180),
			g('bell-pepper', 1, 'pcs'),
			g('onion', 0.5, 'pcs'),
			g('olive-oil', 15, 'ml'),
			g('paprika', 3)
		],
		instructions: [
			'Form seasoned beef into small patties.',
			'Toss vegetables with oil and paprika on a sheet pan.',
			'Roast everything together 28 min at 200°C.'
		]
	}),

	// ── SNACK (10) ──
	defineRecipe({
		id: 'apple-almond-butter',
		title: 'Apple Slices with Almond Butter',
		description: 'Crisp apple wedges with almond butter and cinnamon.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-41',
		prepTime: 3,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 200, protein: 5, carbs: 28, fat: 10, fiber: 5 },
		tags: ['No Cook', 'Quick', 'Fiber'],
		ingredients: [
			g('apple', 1, 'pcs'),
			g('peanut-butter', 20),
			g('cinnamon', 1)
		],
		instructions: ['Slice apple.', 'Serve with almond butter and a dusting of cinnamon.']
	}),
	defineRecipe({
		id: 'hummus-veggies',
		title: 'Hummus & Veggie Sticks',
		description: 'Creamy hummus with carrot, cucumber and bell pepper sticks.',
		cuisine: 'Mediterranean',
		mealType: 'snack',
		image: 'gradient-42',
		prepTime: 8,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 180, protein: 8, carbs: 22, fat: 8, fiber: 7 },
		tags: ['Vegan', 'No Cook', 'Gut Health'],
		ingredients: [
			g('chickpeas', 100),
			g('carrot', 80),
			g('cucumber', 0.5, 'pcs'),
			g('bell-pepper', 0.5, 'pcs'),
			g('olive-oil', 10, 'ml'),
			g('lemon', 0.25, 'pcs')
		],
		instructions: [
			'Blend chickpeas with olive oil and lemon for quick hummus.',
			'Cut vegetables into sticks.',
			'Serve together.'
		]
	}),
	defineRecipe({
		id: 'trail-mix-bowl',
		title: 'Homemade Trail Mix Bowl',
		description: 'Almonds, dried fruit and dark chocolate chips for balanced snacking.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-43',
		prepTime: 3,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 2,
		nutrition: { calories: 220, protein: 6, carbs: 24, fat: 14, fiber: 4 },
		tags: ['No Cook', 'Energy', 'Portable'],
		ingredients: [
			g('almonds', 25),
			g('blueberries', 30),
			g('oats', 20),
			g('honey', 8),
			g('cinnamon', 1)
		],
		instructions: ['Combine all ingredients in a small bowl.', 'Mix and enjoy.']
	}),
	defineRecipe({
		id: 'cottage-cheese-fruit',
		title: 'Cottage Cheese & Berries',
		description: 'High-protein cottage cheese topped with fresh berries and honey.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-44',
		prepTime: 3,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 210, protein: 22, carbs: 18, fat: 5, fiber: 3 },
		tags: ['High Protein', 'No Cook', 'Quick'],
		ingredients: [
			g('greek-yogurt', 150),
			g('strawberries', 50),
			g('blueberries', 30),
			g('honey', 6)
		],
		instructions: ['Spoon yogurt into a bowl.', 'Top with berries and drizzle honey.']
	}),
	defineRecipe({
		id: 'rice-cakes-avocado',
		title: 'Avocado Rice Cake Bites',
		description: 'Crispy rice cakes topped with mashed avocado and chili flakes.',
		cuisine: 'Mediterranean',
		mealType: 'snack',
		image: 'gradient-45',
		prepTime: 5,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 230, protein: 4, carbs: 26, fat: 14, fiber: 6 },
		tags: ['Vegan', 'Healthy Fats', 'Quick'],
		ingredients: [
			g('bread', 1, 'pcs'),
			g('avocado', 0.5, 'pcs'),
			g('lemon', 0.25, 'pcs'),
			g('chili-flakes', 1),
			g('salt', 1)
		],
		instructions: [
			'Mash avocado with lemon and salt.',
			'Spread on toasted bread or rice cake substitute.',
			'Sprinkle with chili flakes.'
		]
	}),
	defineRecipe({
		id: 'protein-smoothie',
		title: 'Green Protein Smoothie',
		description: 'Spinach, banana and yogurt blended into a filling smoothie.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-46',
		prepTime: 5,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 260, protein: 18, carbs: 36, fat: 6, fiber: 6 },
		tags: ['High Protein', 'No Cook', 'Gut Health'],
		ingredients: [
			g('greek-yogurt', 120),
			g('banana', 1, 'pcs'),
			g('spinach', 40),
			g('milk', 100, 'ml'),
			g('chia-seeds', 5)
		],
		instructions: ['Blend all ingredients until smooth.', 'Serve immediately.']
	}),
	defineRecipe({
		id: 'edamame-salt',
		title: 'Steamed Edamame with Sea Salt',
		description: 'Simple steamed soybeans with flaky salt — classic protein snack.',
		cuisine: 'Japanese',
		mealType: 'snack',
		image: 'gradient-47',
		prepTime: 2,
		cookTime: 5,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 170, protein: 14, carbs: 12, fat: 6, fiber: 5 },
		tags: ['High Protein', 'Vegan', 'Quick'],
		ingredients: [g('tofu', 80), g('salt', 2), g('soy-sauce', 10, 'ml')],
		instructions: [
			'Pan-sear tofu cubes until golden.',
			'Drizzle with soy sauce and sprinkle salt.',
			'Serve warm.'
		]
	}),
	defineRecipe({
		id: 'banana-nice-cream',
		title: 'Banana Nice Cream',
		description: 'Blended frozen banana with cocoa and peanut butter.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-48',
		prepTime: 5,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 250, protein: 6, carbs: 38, fat: 10, fiber: 5 },
		tags: ['Vegan', 'No Cook', 'Sweet'],
		ingredients: [
			g('banana', 2, 'pcs'),
			g('peanut-butter', 15),
			g('cinnamon', 1),
			g('almonds', 10)
		],
		instructions: [
			'Freeze banana slices overnight.',
			'Blend until creamy.',
			'Swirl in peanut butter and top with almonds.'
		]
	}),
	defineRecipe({
		id: 'cheese-crackers',
		title: 'Cheese & Whole Grain Crackers',
		description: 'Sliced cheese with whole grain crackers and grapes.',
		cuisine: 'German',
		mealType: 'snack',
		image: 'gradient-49',
		prepTime: 3,
		cookTime: 0,
		difficulty: 'Easy',
		baseServings: 1,
		nutrition: { calories: 240, protein: 12, carbs: 22, fat: 12, fiber: 2 },
		tags: ['Quick', 'Calcium', 'Kid Friendly'],
		ingredients: [
			g('cheese', 40),
			g('bread', 1, 'pcs'),
			g('orange', 1, 'pcs')
		],
		instructions: ['Slice cheese and serve with crackers and grapes.']
	}),
	defineRecipe({
		id: 'roasted-chickpeas',
		title: 'Crispy Roasted Chickpeas',
		description: 'Crunchy spiced chickpeas — a savory high-fiber snack.',
		cuisine: 'Mediterranean',
		mealType: 'snack',
		image: 'gradient-50',
		prepTime: 5,
		cookTime: 25,
		difficulty: 'Easy',
		baseServings: 3,
		nutrition: { calories: 160, protein: 7, carbs: 22, fat: 5, fiber: 6 },
		tags: ['Vegan', 'High Fiber', 'Meal Prep'],
		ingredients: [
			g('chickpeas', 120),
			g('olive-oil', 8, 'ml'),
			g('paprika', 2),
			g('cumin', 2),
			g('salt', 2)
		],
		instructions: [
			'Pat chickpeas dry.',
			'Toss with oil and spices.',
			'Roast at 200°C for 22–25 min until crisp.'
		]
	})
];
