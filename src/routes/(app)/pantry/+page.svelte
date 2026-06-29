<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { ingredients, getIngredient } from '$lib/data/ingredients';
	import { Card, Input, Badge } from '$lib/components/ui';
	import { Search, Plus, Minus, Trash2, Refrigerator } from '@lucide/svelte';

	let search = $state('');

	const pantrySet = $derived(new Set(app.pantryIds));
	const results = $derived(
		search.trim()
			? ingredients
					.filter(
						(i) =>
							i.name.toLowerCase().includes(search.toLowerCase()) && !pantrySet.has(i.id)
					)
					.slice(0, 6)
			: []
	);

	function add(id: string) {
		const ing = getIngredient(id);
		if (!ing) return;
		const defaultAmount = ing.unit === 'pcs' || ing.unit === 'clove' ? 6 : 250;
		app.addPantryItem({ ingredientId: id, amount: defaultAmount, unit: ing.unit });
		search = '';
	}

	function step(id: string, current: number, unit: string, dir: number) {
		const inc = unit === 'pcs' || unit === 'clove' ? 1 : 50;
		app.updatePantryAmount(id, current + dir * inc);
	}
</script>

<div class="px-5 pt-6">
	<header>
		<h1 class="text-2xl font-semibold tracking-tight text-foreground">Pantry</h1>
		<p class="mt-0.5 text-sm text-muted-foreground">
			Staples you keep on hand — excluded from shopping lists.
		</p>
	</header>

	<!-- Search / add -->
	<div class="relative mt-5">
		<Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
		<Input bind:value={search} placeholder="Search to add an ingredient" class="pl-10" />
		{#if results.length}
			<Card padded={false} class="absolute z-20 mt-2 w-full overflow-hidden py-1">
				{#each results as ing (ing.id)}
					<button
						onclick={() => add(ing.id)}
						class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
					>
						<span class="text-lg">{ing.emoji ?? '🍽️'}</span>
						<span class="flex-1 text-sm font-medium text-foreground">{ing.name}</span>
						<Badge variant="outline">{ing.category}</Badge>
						<Plus class="h-4 w-4 text-primary" />
					</button>
				{/each}
			</Card>
		{/if}
	</div>

	<p class="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
		{app.pantry.length} items
	</p>

	{#if app.pantry.length === 0}
		<div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
			<Refrigerator class="h-8 w-8 text-muted-foreground" />
			<p class="text-sm text-muted-foreground">Your pantry is empty. Search above to add staples.</p>
		</div>
	{:else}
		<div class="space-y-2">
			{#each app.pantry as item (item.ingredientId)}
				{@const ing = getIngredient(item.ingredientId)}
				{#if ing}
					<Card padded={false} class="flex items-center gap-3 p-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg">
							{ing.emoji ?? '🍽️'}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-foreground">{ing.name}</p>
							<p class="text-xs text-muted-foreground">{ing.category}</p>
						</div>
						<div class="flex items-center gap-1.5">
							<button
								onclick={() => step(item.ingredientId, item.amount, item.unit, -1)}
								aria-label="Decrease"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
							>
								<Minus class="h-4 w-4" />
							</button>
							<span class="w-16 text-center text-sm tabular-nums text-foreground">
								{item.amount}{item.unit === 'pcs' ? '' : ' ' + item.unit}
							</span>
							<button
								onclick={() => step(item.ingredientId, item.amount, item.unit, 1)}
								aria-label="Increase"
								class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
							>
								<Plus class="h-4 w-4" />
							</button>
							<button
								onclick={() => app.removePantryItem(item.ingredientId)}
								aria-label="Remove {ing.name}"
								class="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</Card>
				{/if}
			{/each}
		</div>
	{/if}
</div>
