<script lang="ts">
	import type { PriceUnit, Unit } from '$lib/types';
	import { app } from '$lib/stores/app.svelte';
	import { defaultPriceUnit, priceUnitLabel, calculateLineCost } from '$lib/pricing';
	import { formatCurrency } from '$lib/utils';
	import { Input, Button } from '$lib/components/ui';
	import { Tag, X } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		ingredientId: string;
		amount: number;
		unit: Unit;
		compact?: boolean;
	};

	let { ingredientId, amount, unit, compact = false }: Props = $props();

	let editing = $state(false);
	let draftPrice = $state('');
	let draftUnit = $state<PriceUnit>('kg');

	const saved = $derived(app.getIngredientPrice(ingredientId));
	const lineCost = $derived(
		saved ? calculateLineCost(amount, unit, saved.price, saved.perUnit) : null
	);

	function openEditor() {
		draftPrice = saved ? String(saved.price) : '';
		draftUnit = saved?.perUnit ?? defaultPriceUnit(unit);
		editing = true;
	}

	function save() {
		const price = parseFloat(draftPrice);
		if (!Number.isFinite(price) || price <= 0) return;
		app.setIngredientPrice(ingredientId, price, draftUnit);
		editing = false;
	}

	function clear() {
		app.removeIngredientPrice(ingredientId);
		editing = false;
	}
</script>

{#if editing}
	<div class={cn('flex flex-col gap-2', compact ? 'min-w-28' : 'min-w-36')}>
		<div class="flex items-center gap-1.5">
			<Input
				type="number"
				step="0.01"
				min="0"
				bind:value={draftPrice}
				placeholder="0.00"
				class="h-9 px-2 text-sm"
			/>
			<select
				bind:value={draftUnit}
				class="h-9 rounded-xl border border-input bg-card px-2 text-xs text-foreground"
			>
				<option value="kg">/ kg</option>
				<option value="l">/ L</option>
				<option value="pcs">/ pcs</option>
			</select>
		</div>
		<div class="flex gap-1">
			<Button size="sm" class="h-8 flex-1 text-xs" onclick={save}>Save</Button>
			<Button size="sm" variant="ghost" class="h-8 px-2" onclick={() => (editing = false)}>
				<X class="h-4 w-4" />
			</Button>
		</div>
	</div>
{:else if saved && lineCost !== null}
	<button
		type="button"
		onclick={openEditor}
		class="group text-right"
		title="{formatCurrency(saved.price)} {priceUnitLabel(saved.perUnit)}"
	>
		<p class="text-sm font-medium tabular-nums text-foreground group-hover:text-primary">
			{formatCurrency(lineCost)}
		</p>
		<p class="text-[10px] text-muted-foreground">{formatCurrency(saved.price)} {priceUnitLabel(saved.perUnit)}</p>
	</button>
{:else if saved}
	<button type="button" onclick={openEditor} class="text-xs text-muted-foreground hover:text-primary">
		Edit price
	</button>
{:else}
	<button
		type="button"
		onclick={openEditor}
		class={cn(
			'inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary',
			compact && 'px-2 py-0.5'
		)}
	>
		<Tag class="h-3 w-3" /> Add price
	</button>
{/if}
