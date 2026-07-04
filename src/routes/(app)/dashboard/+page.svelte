<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import {
		computeWeeklyNutrition,
		computeTodayNutrition,
		getTodayIndex,
		hydrationGoalGlasses,
		computeWeeklyMacros,
		computeWeeklyMicronutrients,
		compareToRDA,
		sharedIngredients,
		describeDayScore
	} from '$lib/nutrition';
	import { buildShoppingList, itemsToBuy } from '$lib/shoppingList';
	import { mealOrder } from '$lib/meta';
	import { Card, Button, Badge } from '$lib/components/ui';
	import MealCard from '$lib/components/MealCard.svelte';
	import NutritionProgress from '$lib/components/NutritionProgress.svelte';
	import GeneratePlanModal from '$lib/components/GeneratePlanModal.svelte';
	import ReplaceMealSheet from '$lib/components/ReplaceMealSheet.svelte';
	import { Sparkles, Droplets, ShoppingBasket, Plus, Minus, ArrowRight, Leaf } from '@lucide/svelte';
	import type { MealType } from '$lib/types';

	let generateOpen = $state(false);
	let replaceOpen = $state(false);
	let replaceTarget = $state<{ dayIndex: number; mealType: MealType } | null>(null);

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	})();

	const todayIndex = $derived(getTodayIndex(app.plan));
	const name = $derived(app.profile.name || 'there');
	const today = $derived(app.plan[todayIndex]);
	const weeklyNutrition = $derived(
		computeWeeklyNutrition(app.plan, app.profile, app.recipeMap, app.activeMembers)
	);
	const todayNutrition = $derived(
		computeTodayNutrition(app.plan, app.profile, todayIndex, app.recipeMap, app.activeMembers)
	);
	const weeklyMacros = $derived(computeWeeklyMacros(app.plan, app.recipeMap, app.activeMembers));
	const nutrientSummary = $derived(
		compareToRDA(
			computeWeeklyMicronutrients(app.plan, app.recipeMap, app.activeMembers),
			app.activeMembers
		)
	);
	const shared = $derived(sharedIngredients(app.plan, app.recipeMap, app.ingredientMap));

	const shoppingPreview = $derived(
		itemsToBuy(
			buildShoppingList(
				app.activeMembers,
				app.pantry,
				app.plan,
				app.recipeMap,
				app.ingredientMap
			)
		)
	);
	const hasTodaysMeals = $derived(
		Boolean(today?.meals.some((m) => m.recipeId && app.getRecipe(m.recipeId)))
	);
	const scoreExplanation = $derived(
		describeDayScore(
			todayNutrition.score,
			todayNutrition.calories,
			todayNutrition.target,
			hasTodaysMeals
		)
	);
	const maxScore = 100;

	const statusColor = (s: string) =>
		s === 'wellCovered' ? 'bg-success/15 text-success' : s === 'moderate' ? 'bg-warning/15 text-warning' : 'bg-destructive/10 text-destructive';

	function openReplace(mealType: MealType) {
		replaceTarget = { dayIndex: todayIndex, mealType };
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
	<header class="flex items-start justify-between">
		<div>
			<p class="text-sm text-muted-foreground">{greeting},</p>
			<h1 class="text-2xl font-semibold tracking-tight text-foreground">{name} 👋</h1>
		</div>
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
			<Leaf class="h-5 w-5" />
		</div>
	</header>

	<button onclick={() => (generateOpen = true)} class="mt-5 w-full text-left">
		<div class="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm transition-transform active:scale-[0.99]">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
				<Sparkles class="h-5 w-5" />
			</div>
			<div class="flex-1">
				<p class="font-semibold">Generate My Week</p>
				<p class="text-xs text-primary-foreground/80">Your full week in under a minute</p>
			</div>
			<ArrowRight class="h-5 w-5" />
		</div>
	</button>

	<Card class="mt-5 flex items-start gap-5">
		<NutritionProgress score={todayNutrition.score} label="Balance" subtitle="of 100" />
		<div class="flex-1">
			<p class="text-sm font-medium text-foreground">{scoreExplanation.title}</p>
			<p class="mt-1 text-xs leading-relaxed text-muted-foreground">{scoreExplanation.detail}</p>
			<p class="mt-3 text-[11px] text-muted-foreground">
				Scores compare today's planned calories to your household target — not food you already ate.
			</p>
			<div class="mt-3">
				<p class="text-xs font-medium text-muted-foreground">This week</p>
				<div class="mt-2 flex items-end gap-1.5">
					{#each weeklyNutrition as d (d.day)}
						<div class="flex flex-1 flex-col items-center gap-1">
							<div class="flex h-12 w-full items-end overflow-hidden rounded-md bg-muted">
								<div
									class="w-full rounded-md bg-primary/80 transition-all duration-700"
									style="height:{(d.score / maxScore) * 100}%"
								></div>
							</div>
							<span class="text-[10px] text-muted-foreground">{d.day}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</Card>

	<Card class="mt-4">
		<h2 class="text-sm font-semibold text-foreground">Weekly nutrition</h2>
		<div class="mt-3 space-y-3">
			<div>
				<div class="flex justify-between text-xs text-muted-foreground">
					<span>Protein</span>
					<span>{weeklyMacros.protein}g / {weeklyMacros.proteinTarget}g</span>
				</div>
				<div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
					<div
						class="h-full rounded-full bg-[var(--chart-protein)]"
						style="width:{Math.min((weeklyMacros.protein / weeklyMacros.proteinTarget) * 100, 100)}%"
					></div>
				</div>
			</div>
			<div>
				<div class="flex justify-between text-xs text-muted-foreground">
					<span>Fiber</span>
					<span>{weeklyMacros.fiber}g / {weeklyMacros.fiberTarget}g</span>
				</div>
				<div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
					<div
						class="h-full rounded-full bg-success"
						style="width:{Math.min((weeklyMacros.fiber / weeklyMacros.fiberTarget) * 100, 100)}%"
					></div>
				</div>
			</div>
		</div>
		<div class="mt-4 flex flex-wrap gap-1.5">
			{#each nutrientSummary as n (n.key)}
				<span
					class="rounded-full px-2.5 py-1 text-[11px] font-medium {statusColor(n.status)}"
					title="{n.label}: {n.total} {n.unit} of ~{n.weeklyTarget} {n.unit} this week"
				>
					{n.label}
				</span>
			{/each}
		</div>
		<p class="mt-2 text-[11px] text-muted-foreground">
			Green = well covered this week · amber = moderate · red = could use more variety
		</p>
	</Card>

	{#if shared.length > 0}
		<Card class="mt-4">
			<p class="text-sm font-medium text-foreground">Shared ingredients this week</p>
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each shared as s (s.name)}
					<Badge variant="outline">{s.name} · {s.count} days</Badge>
				{/each}
			</div>
		</Card>
	{/if}

	<section class="mt-7">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-foreground">Today's meals</h2>
			<a href="/meals" class="text-sm font-medium text-primary">See plan</a>
		</div>
		<div class="space-y-3">
			{#each mealOrder as type (type)}
				{@const meal = today?.meals.find((m) => m.mealType === type)}
				{#if meal}
					{@const recipe = app.getRecipe(meal.recipeId)}
					{#if recipe}
						<MealCard {recipe} reason={meal.reason} onReplace={() => openReplace(type)} />
					{/if}
				{/if}
			{/each}
		</div>
	</section>

	<Card class="mt-4">
		<div class="flex items-center gap-3">
			<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-info/12 text-info">
				<Droplets class="h-5 w-5" />
			</div>
			<div class="flex-1">
				<p class="font-medium text-foreground">Hydration</p>
				<p class="text-xs text-muted-foreground">
					{app.hydrationGlasses} of {hydrationGoalGlasses} glasses today
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => app.setHydrationGlasses(app.hydrationGlasses - 1)}
					aria-label="Remove glass"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
				>
					<Minus class="h-4 w-4" />
				</button>
				<button
					onclick={() =>
						app.setHydrationGlasses(Math.min(hydrationGoalGlasses, app.hydrationGlasses + 1))}
					aria-label="Add glass"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-info text-white"
				>
					<Plus class="h-4 w-4" />
				</button>
			</div>
		</div>
		<div class="mt-3 flex gap-1.5">
			{#each Array(hydrationGoalGlasses) as _, i (i)}
				<div
					class="h-2 flex-1 rounded-full transition-colors {i < app.hydrationGlasses ? 'bg-info' : 'bg-muted'}"
				></div>
			{/each}
		</div>
	</Card>

	<section class="mt-4">
		<a href="/shopping">
			<Card class="transition-transform active:scale-[0.99]">
				<div class="flex items-center gap-3">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<ShoppingBasket class="h-5 w-5" />
					</div>
					<div>
						<p class="font-medium text-foreground">Shopping list</p>
						<p class="text-xs text-muted-foreground">{shoppingPreview.length} items to buy</p>
					</div>
				</div>
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each shoppingPreview.slice(0, 5) as item (item.id)}
						<Badge variant="outline">{item.name}</Badge>
					{/each}
					{#if shoppingPreview.length > 5}
						<Badge variant="primary">+{shoppingPreview.length - 5} more</Badge>
					{/if}
				</div>
			</Card>
		</a>
	</section>
</div>
