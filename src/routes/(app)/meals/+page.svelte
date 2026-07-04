<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { mealOrder, mealMeta } from '$lib/meta';
	import { getTodayIndex, computeWeeklyNutrition } from '$lib/nutrition';
	import { mealServingFactor } from '$lib/household';
	import { planHasFilledMeals } from '$lib/plan/planUtils';
	import WeeklyCalendar from '$lib/components/WeeklyCalendar.svelte';
	import MealCard from '$lib/components/MealCard.svelte';
	import GeneratePlanModal from '$lib/components/GeneratePlanModal.svelte';
	import ReplaceMealSheet from '$lib/components/ReplaceMealSheet.svelte';
	import { Button } from '$lib/components/ui';
	import { Sparkles, Users, ArrowRight } from '@lucide/svelte';
	import type { MealType } from '$lib/types';
	import { countFilledMeals, countReviewedMeals } from '$lib/plan/planUtils';

	let selected = $state(getTodayIndex(app.plan));
	let generateOpen = $state(false);
	let replaceOpen = $state(false);
	let replaceTarget = $state<{ dayIndex: number; mealType: MealType } | null>(null);

	const day = $derived(app.plan[selected] ?? app.plan[0]);
	const weeklyScores = $derived(
		computeWeeklyNutrition(app.plan, app.profile, app.recipeMap, app.activeMembers).map((d) => d.score)
	);
	const dayMacros = $derived(
		(day?.meals ?? []).reduce(
			(acc, m) => {
				const r = app.getRecipe(m.recipeId);
				if (r) {
					const factor = mealServingFactor(app.activeMembers, m.mealType);
					acc.calories += r.nutrition.calories * factor;
					acc.protein += r.nutrition.protein * factor;
				}
				return acc;
			},
			{ calories: 0, protein: 0 }
		)
	);
	const hasPlan = $derived(planHasFilledMeals(app.plan));
	const missingRecipes = $derived(
		hasPlan &&
			(day?.meals ?? []).some((m) => m.recipeId && !app.getRecipe(m.recipeId))
	);
	const reviewPending = $derived(
		hasPlan && countReviewedMeals(app.plan) < countFilledMeals(app.plan)
	);

	function openReplace(mealType: MealType) {
		replaceTarget = { dayIndex: selected, mealType };
		replaceOpen = true;
	}
</script>

{#if replaceTarget}
	<ReplaceMealSheet
		bind:open={replaceOpen}
		dayIndex={replaceTarget.dayIndex}
		mealType={replaceTarget.mealType}
	/>
{/if}

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
		{#if hasPlan}
			<Button variant="secondary" size="icon" onclick={() => (generateOpen = true)} aria-label="Generate My Week">
				<Sparkles class="h-5 w-5 text-primary" />
			</Button>
		{/if}
	</header>

	{#if !hasPlan}
		<div class="mt-16 flex flex-col items-center text-center">
			<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
				<Sparkles class="h-8 w-8" />
			</div>
			<h2 class="mt-4 text-lg font-semibold text-foreground">No plan yet</h2>
			<p class="mt-2 max-w-xs text-sm text-muted-foreground">
				Generate your entire week of meals in one tap — breakfast through snacks, scaled for your household.
			</p>
			<Button class="mt-6 gap-2" onclick={() => (generateOpen = true)}>
				<Sparkles class="h-4 w-4" /> Generate My Week
			</Button>
		</div>
	{:else}
		{#if reviewPending}
			<a
				href="/meals/review"
				class="mt-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm"
			>
				<span class="font-medium text-foreground">Continue reviewing your new week</span>
				<ArrowRight class="h-4 w-4 text-primary" />
			</a>
		{/if}

		<div class="mt-5">
			<WeeklyCalendar plan={app.plan} bind:selected dayScores={weeklyScores} />
		</div>

		<div class="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
			<span class="text-sm font-medium text-secondary-foreground">{day?.day ?? '—'}</span>
			<div class="flex gap-4 text-sm">
				<span class="text-muted-foreground">{Math.round(dayMacros.calories)} kcal</span>
				<span class="text-muted-foreground">{Math.round(dayMacros.protein)}g protein</span>
			</div>
		</div>

		{#if missingRecipes}
			<p class="mt-3 rounded-xl bg-warning/10 px-3 py-2 text-xs text-muted-foreground">
				Some recipes are missing from the catalog. Run <code class="rounded bg-muted px-1">pnpm run seed</code> and
				regenerate your week.
			</p>
		{/if}

		<div class="mt-5 space-y-5">
			{#each mealOrder as type (type)}
				{@const meal = day?.meals.find((m) => m.mealType === type)}
				{#if meal?.recipeId}
					{@const recipe = app.getRecipe(meal.recipeId)}
					<div>
						<div class="mb-2 flex items-center gap-2">
							<span class="text-base" aria-hidden="true">{mealMeta[type].emoji}</span>
							<h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
								{mealMeta[type].label}
							</h2>
						</div>
						{#if recipe}
							<MealCard
								{recipe}
								reason={meal.reason}
								onReplace={() => openReplace(type)}
							/>
						{:else}
							<div class="rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
								Recipe "{meal.recipeId}" not found in catalog.
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
