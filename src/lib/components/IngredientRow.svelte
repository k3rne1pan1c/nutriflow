<script lang="ts">
	import { getIngredient } from '$lib/data/ingredients';
	import { Badge } from '$lib/components/ui';
	import { app } from '$lib/stores/app.svelte';

	type Props = {
		ingredientId: string;
		amount: number;
		unit: string;
	};

	let { ingredientId, amount, unit }: Props = $props();
	const ingredient = $derived(getIngredient(ingredientId));
	const inPantry = $derived(app.pantryIds.includes(ingredientId));
</script>

{#if ingredient}
	<div class="flex items-center gap-3 py-3">
		<div
			class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg"
			aria-hidden="true"
		>
			{ingredient.emoji ?? '🍽️'}
		</div>
		<span class="flex-1 text-sm font-medium text-foreground">{ingredient.name}</span>
		{#if inPantry}
			<Badge variant="success">In pantry</Badge>
		{/if}
		<span class="text-sm tabular-nums text-muted-foreground">
			{amount}{unit === 'pcs' ? '' : ' ' + unit}{unit === 'pcs' ? ' pcs' : ''}
		</span>
	</div>
{/if}
