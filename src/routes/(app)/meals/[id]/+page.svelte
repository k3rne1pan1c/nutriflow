<script lang="ts">
	import { page } from '$app/state';
	import { getRecipe } from '$lib/data/recipes';
	import { app } from '$lib/stores/app.svelte';
	import RecipeImage from '$lib/components/RecipeImage.svelte';
	import IngredientRow from '$lib/components/IngredientRow.svelte';
	import MacroCard from '$lib/components/MacroCard.svelte';
	import { Card, Button, Badge, Separator } from '$lib/components/ui';
	import { mealMeta } from '$lib/meta';
	import {
		ArrowLeft,
		Heart,
		Clock,
		ChefHat,
		Users,
		Sparkles,
		Leaf,
		Repeat,
		Lightbulb,
		Flame
	} from '@lucide/svelte';
	import { cn } from '$lib/utils';

	const recipe = $derived(getRecipe(page.params.id ?? ''));
	const isFav = $derived(recipe ? app.isFavorite(recipe.id) : false);
	const totalTime = $derived(recipe ? recipe.prepTime + recipe.cookTime : 0);
</script>

{#if recipe}
	<div class="pb-6">
		<!-- Hero -->
		<header class="relative">
			<RecipeImage {recipe} variant="hero" rounded="rounded-none" />
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent"
			></div>

			<div class="absolute inset-x-0 top-0 flex items-center justify-between p-4">
				<button
					onclick={() => history.back()}
					aria-label="Back"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border/50 backdrop-blur-sm transition-transform active:scale-95"
				>
					<ArrowLeft class="h-5 w-5" />
				</button>
				<button
					onclick={() => app.toggleFavorite(recipe.id)}
					aria-label="Save as favorite"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-md ring-1 ring-border/50 backdrop-blur-sm transition-transform active:scale-95"
				>
					<Heart class={cn('h-5 w-5 text-foreground', isFav && 'fill-destructive text-destructive')} />
				</button>
			</div>

			<div class="absolute inset-x-0 bottom-0 px-5 pb-5">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="primary">{mealMeta[recipe.mealType].label}</Badge>
					<Badge variant="outline" class="border-background/40 bg-background/70 text-foreground backdrop-blur-sm">
						{recipe.cuisine}
					</Badge>
				</div>
				<h1 class="mt-2 text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground">
					{recipe.title}
				</h1>
			</div>
		</header>

		<div class="px-5 pt-4">
			<p class="text-sm leading-relaxed text-muted-foreground">{recipe.description}</p>

			<!-- Quick stats -->
			<div class="mt-5 grid grid-cols-3 gap-3">
				<div class="flex flex-col items-center rounded-2xl bg-secondary py-3">
					<Clock class="h-5 w-5 text-primary" />
					<span class="mt-1 text-sm font-semibold text-foreground">{totalTime} min</span>
					<span class="text-[11px] text-muted-foreground">Total time</span>
				</div>
				<div class="flex flex-col items-center rounded-2xl bg-secondary py-3">
					<ChefHat class="h-5 w-5 text-primary" />
					<span class="mt-1 text-sm font-semibold text-foreground">{recipe.difficulty}</span>
					<span class="text-[11px] text-muted-foreground">Difficulty</span>
				</div>
				<div class="flex flex-col items-center rounded-2xl bg-secondary py-3">
					<Users class="h-5 w-5 text-primary" />
					<span class="mt-1 text-sm font-semibold text-foreground">{recipe.baseServings}</span>
					<span class="text-[11px] text-muted-foreground">Servings</span>
				</div>
			</div>

			<!-- Nutrition facts -->
			<section class="mt-7">
				<h2 class="mb-3 text-lg font-semibold text-foreground">Nutrition facts</h2>
				<div class="grid grid-cols-2 gap-3">
					<MacroCard label="Calories" value={recipe.nutrition.calories} unit=" kcal" color="var(--primary)" />
					<MacroCard label="Protein" value={recipe.nutrition.protein} color="var(--chart-protein)" />
					<MacroCard label="Carbs" value={recipe.nutrition.carbs} color="var(--chart-carbs)" />
					<MacroCard label="Fat" value={recipe.nutrition.fat} color="var(--chart-fat)" />
				</div>
				<p class="mt-2 text-xs text-muted-foreground">Per serving · {recipe.nutrition.fiber}g fiber</p>
			</section>

			<!-- Ingredients -->
			<section class="mt-7">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-foreground">Ingredients</h2>
					<span class="text-xs text-muted-foreground">for {recipe.baseServings} servings</span>
				</div>
				<Card class="mt-3 divide-y divide-border/70 py-0">
					{#each recipe.ingredients as ing (ing.ingredientId)}
						<IngredientRow
							ingredientId={ing.ingredientId}
							amount={Math.round(ing.amountPerServing * recipe.baseServings)}
							unit={ing.unit}
						/>
					{/each}
				</Card>
			</section>

			<!-- Instructions -->
			<section class="mt-7">
				<h2 class="mb-3 text-lg font-semibold text-foreground">Instructions</h2>
				<ol class="space-y-3">
					{#each recipe.instructions as instruction, i (i)}
						<li class="flex gap-3">
							<span
								class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
								>{i + 1}</span
							>
							<p class="pt-0.5 text-sm leading-relaxed text-foreground">{instruction}</p>
						</li>
					{/each}
				</ol>
			</section>

			<!-- Health benefits -->
			<section class="mt-7">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
					<Leaf class="h-5 w-5 text-success" /> Health benefits
				</h2>
				<div class="space-y-2">
					{#each recipe.healthBenefits as benefit (benefit)}
						<div class="flex items-start gap-2.5 rounded-2xl bg-success/8 px-4 py-3">
							<Sparkles class="mt-0.5 h-4 w-4 shrink-0 text-success" />
							<p class="text-sm text-foreground">{benefit}</p>
						</div>
					{/each}
				</div>
			</section>

			<!-- Substitutions -->
			<section class="mt-7">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
					<Repeat class="h-5 w-5 text-info" /> Possible substitutions
				</h2>
				<Card class="divide-y divide-border/70 py-0">
					{#each recipe.substitutions as sub (sub.from)}
						<div class="flex items-center gap-2 py-3 text-sm">
							<span class="font-medium text-foreground">{sub.from}</span>
							<ArrowLeft class="h-4 w-4 rotate-180 text-muted-foreground" />
							<span class="text-muted-foreground">{sub.to}</span>
						</div>
					{/each}
				</Card>
			</section>

			<!-- Meal prep tips -->
			<section class="mt-7">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
					<Lightbulb class="h-5 w-5 text-warning" /> Meal prep tips
				</h2>
				<div class="space-y-2">
					{#each recipe.mealPrepTips as tip (tip)}
						<div class="flex items-start gap-2.5">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"></span>
							<p class="text-sm text-foreground">{tip}</p>
						</div>
					{/each}
				</div>
			</section>

			<Separator class="my-7" />

			<Button onclick={() => app.toggleFavorite(recipe.id)} variant={isFav ? 'secondary' : 'default'} class="w-full gap-2">
				<Heart class={cn('h-5 w-5', isFav && 'fill-current')} />
				{isFav ? 'Saved to favorites' : 'Save as favorite'}
			</Button>
		</div>
	</div>
{:else}
	<div class="flex min-h-dvh flex-col items-center justify-center gap-4 px-5">
		<Flame class="h-10 w-10 text-muted-foreground" />
		<p class="text-muted-foreground">Recipe not found.</p>
		<Button href="/meals" variant="secondary">Back to meals</Button>
	</div>
{/if}
