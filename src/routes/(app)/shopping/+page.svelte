<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { buildShoppingList, groupByCategory, itemsToBuy } from '$lib/shoppingList';
	import ShoppingItemRow from '$lib/components/ShoppingItem.svelte';
	import { Card, Badge } from '$lib/components/ui';
	import { Users, Sparkles } from '@lucide/svelte';

	const categoryEmoji: Record<string, string> = {
		Vegetables: '🥬',
		Protein: '🍗',
		Fruit: '🍓',
		Grains: '🌾',
		Dairy: '🧀',
		Spices: '🧂',
		Other: '🫒'
	};

	const allItems = $derived(
		buildShoppingList(
			app.activeMembers,
			app.pantry,
			app.plan,
			app.recipeMap,
			app.ingredientMap,
			{ includeCovered: true }
		).map((i) => ({
			...i,
			checked: app.isShoppingChecked(i.id)
		}))
	);
	const items = $derived(itemsToBuy(allItems));
	const covered = $derived(allItems.filter((i) => i.fullyCoveredByPantry));
	const groups = $derived(groupByCategory(items));
	const checkedCount = $derived(items.filter((i) => i.checked).length);
</script>

<div class="px-5 pt-6">
	<header>
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Shopping list</h1>
		<p class="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
			<Users class="h-3.5 w-3.5" />
			{app.activePeopleLabel} · {items.length} items to buy
		</p>
	</header>

	<Card class="mt-5">
		<p class="text-sm text-muted-foreground">{checkedCount} of {items.length} items checked off</p>
		<p class="mt-1 text-xs text-muted-foreground">
			Optional: tap <span class="font-medium">Add price</span> on any item to note what you usually pay locally.
		</p>
	</Card>

	<div class="mt-4 flex items-center gap-2 rounded-2xl bg-success/8 px-4 py-3">
		<Sparkles class="h-4 w-4 shrink-0 text-success" />
		<p class="text-xs text-foreground">
			Quantities are scaled to your household. Pantry stock is deducted to reduce waste.
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

	{#if covered.length > 0}
		<details class="mt-5">
			<summary class="cursor-pointer text-sm font-medium text-muted-foreground">
				Covered by pantry ({covered.length})
			</summary>
			<Card class="mt-2 divide-y divide-border/70 py-1">
				{#each covered as item (item.id)}
					<ShoppingItemRow {item} />
				{/each}
			</Card>
		</details>
	{/if}
</div>
