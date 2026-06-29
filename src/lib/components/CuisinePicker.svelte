<script lang="ts">
	import type { CuisineRecommendation } from '$lib/cuisineGuidance';
	import { cuisineOptions } from '$lib/meta';
	import { applyRecommendedCuisines } from '$lib/cuisineGuidance';
	import MultiSelect from './MultiSelect.svelte';
	import Chip from './Chip.svelte';
	import { Card, Button } from '$lib/components/ui';
	import { MapPin, Sparkles } from '@lucide/svelte';

	type Props = {
		recommendation: CuisineRecommendation | null;
		selected?: string[];
	};

	let { recommendation, selected = $bindable([]) }: Props = $props();

	function toggleCuisine(cuisine: string) {
		selected = selected.includes(cuisine)
			? selected.filter((c) => c !== cuisine)
			: [...selected, cuisine];
	}

	function useLocalRecommendations() {
		if (!recommendation) return;
		selected = applyRecommendedCuisines(selected, recommendation.cuisines);
	}
</script>

{#if recommendation}
	<Card class="border-primary/20 bg-primary/5">
		<div class="flex items-start gap-3">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
				<MapPin class="h-5 w-5" />
			</div>
			<div class="min-w-0 flex-1">
				<h3 class="font-semibold text-foreground">Local picks for {recommendation.regionLabel}</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{recommendation.context}</p>
			</div>
		</div>
		<div class="mt-3 flex flex-wrap gap-2">
			{#each recommendation.cuisines as cuisine (cuisine)}
				<Chip
					label={cuisine}
					selected={selected.includes(cuisine)}
					onclick={() => toggleCuisine(cuisine)}
				/>
			{/each}
		</div>
		<Button variant="secondary" size="sm" class="mt-3 gap-1.5" onclick={useLocalRecommendations}>
			<Sparkles class="h-4 w-4" /> Use all local recommendations
		</Button>
	</Card>
{/if}

<div class="mt-5">
	<p class="text-sm font-medium text-foreground">Or choose cuisines you'd like to eat</p>
	<p class="mt-0.5 text-xs text-muted-foreground">Pick any styles you enjoy — not just what's local.</p>
	<div class="mt-3">
		<MultiSelect options={cuisineOptions} bind:selected />
	</div>
</div>

{#if selected.length > 0}
	<p class="mt-3 text-xs text-muted-foreground">
		{selected.length} cuisine{selected.length === 1 ? '' : 's'} selected: {selected.join(', ')}
	</p>
{/if}
