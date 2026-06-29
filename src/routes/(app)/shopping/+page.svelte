<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { buildShoppingList, groupByCategory } from '$lib/data/shoppingList';
	import { calculateLineCost } from '$lib/pricing';
	import ShoppingItemRow from '$lib/components/ShoppingItem.svelte';
	import { Card, Badge } from '$lib/components/ui';
	import { Users, Sparkles, Tag } from '@lucide/svelte';
	import { formatCurrency } from '$lib/utils';

	const categoryEmoji: Record<string, string> = {
		Vegetables: '🥬',
		Protein: '🍗',
		Fruit: '🍓',
		Grains: '🌾',
		Dairy: '🧀',
		Spices: '🧂',
		Other: '🫒'
	};

	const items = $derived(
		buildShoppingList(app.activeMembers, app.pantryIds).map((i) => ({
			...i,
			checked: app.isShoppingChecked(i.id)
		}))
	);
	const groups = $derived(groupByCategory(items));
	const toBuy = $derived(items.filter((i) => !i.inPantry));
	const checkedCount = $derived(toBuy.filter((i) => i.checked).length);
	const budget = $derived(app.profile.weeklyBudget || 120);

	function lineCost(item: (typeof items)[number]) {
		const price = app.getIngredientPrice(item.ingredientId);
		if (!price) return null;
		return calculateLineCost(item.amount, item.unit, price.price, price.perUnit);
	}

	const pricedItems = $derived(toBuy.filter((i) => lineCost(i) !== null));
	const total = $derived(pricedItems.reduce((sum, i) => sum + (lineCost(i) ?? 0), 0));
	const hasAnyPrices = $derived(pricedItems.length > 0);
	const allPriced = $derived(pricedItems.length === toBuy.length && toBuy.length > 0);
</script>

<div class="px-5 pt-6">
	<header>
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Shopping list</h1>
		<p class="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
			<Users class="h-3.5 w-3.5" />
			{app.activePeopleLabel} · {toBuy.length} items
		</p>
	</header>

	<Card class="mt-5">
		{#if hasAnyPrices}
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Your estimated total</p>
					<p class="text-2xl font-semibold text-foreground">{formatCurrency(total)}</p>
				</div>
				<div class="text-right">
					<p class="text-sm text-muted-foreground">Weekly budget</p>
					<p class="text-sm font-medium {total <= budget ? 'text-success' : 'text-destructive'}">
						{total <= budget ? formatCurrency(budget - total) + ' left' : formatCurrency(total - budget) + ' over'}
					</p>
				</div>
			</div>
			<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
				<div
					class="h-full rounded-full bg-primary transition-all duration-500"
					style="width:{Math.min((total / budget) * 100, 100)}%"
				></div>
			</div>
			{#if !allPriced}
				<p class="mt-2 text-xs text-muted-foreground">
					Based on {pricedItems.length} of {toBuy.length} items with your local prices added.
				</p>
			{/if}
		{:else}
			<div class="flex items-start gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Tag class="h-5 w-5" />
				</div>
				<div>
					<p class="font-medium text-foreground">Add your local prices</p>
					<p class="mt-1 text-sm text-muted-foreground">
						Tap <span class="font-medium">Add price</span> on any item — per kg, per liter, or per piece — to
						track what this week actually costs where you shop.
					</p>
				</div>
			</div>
		{/if}
		<p class="mt-3 text-xs text-muted-foreground">{checkedCount} of {toBuy.length} items checked off</p>
	</Card>

	<div class="mt-4 flex items-center gap-2 rounded-2xl bg-success/8 px-4 py-3">
		<Sparkles class="h-4 w-4 shrink-0 text-success" />
		<p class="text-xs text-foreground">
			Quantities are scaled to your active household and pantry staples are excluded to avoid waste.
		</p>
	</div>

	<div class="mt-5 space-y-5">
		{#each groups as group (group.category)}
			<section>
				<div class="mb-1 flex items-center gap-2">
					<span aria-hidden="true">{categoryEmoji[group.category]}</span>
					<h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						{group.category}
					</h2>
					<Badge variant="outline" class="ml-auto">{group.items.length}</Badge>
				</div>
				<Card class="divide-y divide-border/70 py-1">
					{#each group.items as item (item.id)}
						<ShoppingItemRow {item} onToggle={() => app.toggleShopping(item.id)} />
					{/each}
				</Card>
			</section>
		{/each}
	</div>

	{#if hasAnyPrices}
		<div class="mt-6 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
			<span class="font-medium">Total with your prices</span>
			<span class="text-xl font-semibold">{formatCurrency(total)}</span>
		</div>
	{/if}
</div>
