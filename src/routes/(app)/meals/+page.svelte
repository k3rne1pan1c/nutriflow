<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { getRecipe } from '$lib/data/recipes';
	import { mealOrder, mealMeta } from '$lib/meta';
	import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
	import MealCard from '$lib/components/MealCard.svelte';
	import GeneratePlanModal from '$lib/components/GeneratePlanModal.svelte';
	import { Button } from '$lib/components/ui';
	import { Sparkles, Users } from '@lucide/svelte';

	let selected = $state(0);
	let generateOpen = $state(false);

	const day = $derived(app.plan[selected]);
	const dayMacros = $derived(
		day.meals.reduce(
			(acc, m) => {
				const r = getRecipe(m.recipeId);
				if (r) {
					acc.calories += r.nutrition.calories;
					acc.protein += r.nutrition.protein;
				}
				return acc;
			},
			{ calories: 0, protein: 0 }
		)
	);
</script>

<GeneratePlanModal bind:open={generateOpen} />

<div class="px-5 pt-6">
	<header class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight text-foreground">Meal plan</h1>
			<p class="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
				<Users class="h-3.5 w-3.5" />
				{app.activePeopleLabel}
			</p>
		</div>
		<Button variant="secondary" size="icon" onclick={() => (generateOpen = true)} aria-label="Generate plan">
			<Sparkles class="h-5 w-5 text-primary" />
		</Button>
	</header>

	<div class="mt-5">
		<WeeklyCalendar plan={app.plan} bind:selected />
	</div>

	<!-- Day summary -->
	<div class="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
		<span class="text-sm font-medium text-secondary-foreground">{day.day}</span>
		<div class="flex gap-4 text-sm">
			<span class="text-muted-foreground">{dayMacros.calories} kcal</span>
			<span class="text-muted-foreground">{dayMacros.protein}g protein</span>
		</div>
	</div>

	<!-- Meals -->
	<div class="mt-5 space-y-5">
		{#each mealOrder as type (type)}
			{@const meal = day.meals.find((m) => m.mealType === type)}
			{#if meal}
				{@const recipe = getRecipe(meal.recipeId)}
				{#if recipe}
					<div>
						<div class="mb-2 flex items-center gap-2">
							<span class="text-base" aria-hidden="true">{mealMeta[type].emoji}</span>
							<h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
								{mealMeta[type].label}
							</h2>
						</div>
						<MealCard {recipe} onReplace={() => app.replaceMeal(selected, type)} />
					</div>
				{/if}
			{/if}
		{/each}
	</div>
</div>
