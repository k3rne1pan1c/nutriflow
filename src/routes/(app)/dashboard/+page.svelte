<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { getRecipe } from '$lib/data/recipes';
	import { todayIndex } from '$lib/data/mealPlan';
	import { weeklyNutrition, todayNutritionScore, hydration } from '$lib/data/nutrition';
	import { buildShoppingList } from '$lib/data/shoppingList';
	import { calculateLineCost } from '$lib/pricing';
	import { mealOrder } from '$lib/meta';
	import { Card, Button, Badge } from '$lib/components/ui';
	import MealCard from '$lib/components/MealCard.svelte';
	import NutritionProgress from '$lib/components/NutritionProgress.svelte';
	import GeneratePlanModal from '$lib/components/GeneratePlanModal.svelte';
	import { Sparkles, Droplets, ShoppingBasket, Plus, Minus, ArrowRight, Leaf } from '@lucide/svelte';
	import { formatCurrency } from '$lib/utils';

	let generateOpen = $state(false);

	const greeting = (() => {
		const h = new Date().getHours();
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	})();

	const name = $derived(app.profile.name || 'there');
	const today = $derived(app.plan[todayIndex]);

	const shoppingPreview = $derived(buildShoppingList(app.activeMembers, app.pantryIds));
	const remainingItems = $derived(shoppingPreview.filter((i) => !i.inPantry));
	const weekTotal = $derived(
		remainingItems.reduce((sum, item) => {
			const price = app.getIngredientPrice(item.ingredientId);
			if (!price) return sum;
			return sum + (calculateLineCost(item.amount, item.unit, price.price, price.perUnit) ?? 0);
		}, 0)
	);
	const hasShoppingPrices = $derived(
		remainingItems.some((i) => app.getIngredientPrice(i.ingredientId))
	);
	const maxScore = 100;
</script>

<GeneratePlanModal bind:open={generateOpen} />

<div class="px-5 pt-6">
	<!-- Greeting -->
	<header class="flex items-start justify-between">
		<div>
			<p class="text-sm text-muted-foreground">{greeting},</p>
			<h1 class="text-2xl font-semibold tracking-tight text-foreground">{name} 👋</h1>
		</div>
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
			<Leaf class="h-5 w-5" />
		</div>
	</header>

	<!-- Nutrition + week progress -->
	<Card class="mt-5 flex items-center gap-5">
		<NutritionProgress score={todayNutritionScore} label="Score" />
		<div class="flex-1">
			<p class="text-sm font-medium text-foreground">This week</p>
			<p class="text-xs text-muted-foreground">You're eating beautifully balanced.</p>
			<div class="mt-3 flex items-end gap-1.5">
				{#each weeklyNutrition as d (d.day)}
					<div class="flex flex-1 flex-col items-center gap-1">
						<div class="flex h-16 w-full items-end overflow-hidden rounded-md bg-muted">
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
	</Card>

	<!-- Generate week -->
	<button onclick={() => (generateOpen = true)} class="mt-4 w-full text-left">
		<div class="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm transition-transform active:scale-[0.99]">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
				<Sparkles class="h-5 w-5" />
			</div>
			<div class="flex-1">
				<p class="font-semibold">Generate new week</p>
				<p class="text-xs text-primary-foreground/80">AI-personalized to your goals</p>
			</div>
			<ArrowRight class="h-5 w-5" />
		</div>
	</button>

	<!-- Today's meals -->
	<section class="mt-7">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-foreground">Today's meals</h2>
			<a href="/meals" class="text-sm font-medium text-primary">See plan</a>
		</div>
		<div class="space-y-3">
			{#each mealOrder as type (type)}
				{@const meal = today.meals.find((m) => m.mealType === type)}
				{#if meal}
					{@const recipe = getRecipe(meal.recipeId)}
					{#if recipe}
						<MealCard {recipe} onReplace={() => app.replaceMeal(todayIndex, type)} />
					{/if}
				{/if}
			{/each}
		</div>
	</section>

	<!-- Hydration -->
	<Card class="mt-4">
		<div class="flex items-center gap-3">
			<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-info/12 text-info">
				<Droplets class="h-5 w-5" />
			</div>
			<div class="flex-1">
				<p class="font-medium text-foreground">Hydration</p>
				<p class="text-xs text-muted-foreground">
					{app.hydrationGlasses} of {hydration.goalGlasses} glasses today
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (app.hydrationGlasses = Math.max(0, app.hydrationGlasses - 1))}
					aria-label="Remove glass"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
				>
					<Minus class="h-4 w-4" />
				</button>
				<button
					onclick={() => (app.hydrationGlasses = Math.min(hydration.goalGlasses, app.hydrationGlasses + 1))}
					aria-label="Add glass"
					class="flex h-8 w-8 items-center justify-center rounded-full bg-info text-white"
				>
					<Plus class="h-4 w-4" />
				</button>
			</div>
		</div>
		<div class="mt-3 flex gap-1.5">
			{#each Array(hydration.goalGlasses) as _, i (i)}
				<div
					class="h-2 flex-1 rounded-full transition-colors {i < app.hydrationGlasses ? 'bg-info' : 'bg-muted'}"
				></div>
			{/each}
		</div>
	</Card>

	<!-- Shopping preview -->
	<section class="mt-4">
		<a href="/shopping">
			<Card class="transition-transform active:scale-[0.99]">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<ShoppingBasket class="h-5 w-5" />
						</div>
						<div>
							<p class="font-medium text-foreground">Shopping list</p>
							<p class="text-xs text-muted-foreground">{remainingItems.length} items to buy</p>
						</div>
					</div>
					<div class="text-right">
						{#if hasShoppingPrices}
							<p class="font-semibold text-foreground">{formatCurrency(weekTotal)}</p>
							<p class="text-xs text-muted-foreground">with your prices</p>
						{:else}
							<p class="text-sm font-medium text-muted-foreground">Add prices</p>
							<p class="text-xs text-muted-foreground">in shopping list</p>
						{/if}
					</div>
				</div>
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each remainingItems.slice(0, 5) as item (item.id)}
						<Badge variant="outline">{item.name}</Badge>
					{/each}
					{#if remainingItems.length > 5}
						<Badge variant="primary">+{remainingItems.length - 5} more</Badge>
					{/if}
				</div>
			</Card>
		</a>
	</section>
</div>
