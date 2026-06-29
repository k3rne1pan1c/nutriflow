<script lang="ts">
	import type { ShoppingItem } from '$lib/types';
	import { getIngredient } from '$lib/data/ingredients';
	import { Badge } from '$lib/components/ui';
	import IngredientPriceEditor from '$lib/components/IngredientPriceEditor.svelte';
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		item: ShoppingItem;
		onToggle?: () => void;
	};

	let { item, onToggle }: Props = $props();
	const ingredient = $derived(getIngredient(item.ingredientId));
</script>

<div class="flex items-center gap-3 py-2.5">
	<button
		onclick={onToggle}
		aria-label="Toggle {item.name}"
		aria-pressed={item.checked}
		class={cn(
			'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
			item.checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'
		)}
	>
		{#if item.checked}<Check class="h-4 w-4" />{/if}
	</button>

	<span class="text-base" aria-hidden="true">{ingredient?.emoji ?? '🍽️'}</span>

	<div class="min-w-0 flex-1">
		<p
			class={cn(
				'truncate text-sm font-medium transition-colors',
				item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
			)}
		>
			{item.name}
		</p>
		<div class="mt-0.5 flex items-center gap-2">
			<span class="text-xs text-muted-foreground"
				>{item.amount}{item.unit === 'pcs' ? ' pcs' : ' ' + item.unit}</span
			>
			{#if item.inPantry}
				<Badge variant="success">In pantry</Badge>
			{/if}
		</div>
	</div>

	{#if !item.inPantry}
		<IngredientPriceEditor ingredientId={item.ingredientId} amount={item.amount} unit={item.unit} compact />
	{/if}
</div>
