<script lang="ts">
	import type { NutrientGuidance } from '$lib/dietGuidance';
	import { Card, Badge } from '$lib/components/ui';
	import { Leaf, UtensilsCrossed, Pill, AlertCircle, MapPin } from '@lucide/svelte';

	type Props = {
		guidance: NutrientGuidance;
	};

	let { guidance }: Props = $props();
</script>

<Card class="mt-4 border-primary/20 bg-primary/5">
	<div class="flex items-start gap-3">
		<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
			<Leaf class="h-5 w-5" />
		</div>
		<div class="min-w-0 flex-1">
			<h3 class="font-semibold text-foreground">{guidance.title}</h3>
			<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{guidance.intro}</p>
		</div>
	</div>

	{#if guidance.locationNote}
		<div class="mt-3 flex gap-2 rounded-xl bg-info/10 px-3.5 py-2.5">
			<MapPin class="mt-0.5 h-4 w-4 shrink-0 text-info" />
			<p class="text-sm leading-relaxed text-foreground">{guidance.locationNote}</p>
		</div>
	{/if}

	<div class="mt-4">
		<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
			{guidance.oftenLowerLabel}
		</p>
		<div class="mt-2 flex flex-wrap gap-1.5">
			{#each guidance.oftenLower as nutrient (nutrient)}
				<Badge variant="outline">{nutrient}</Badge>
			{/each}
		</div>
	</div>

	<div class="mt-4">
		<p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
			<UtensilsCrossed class="h-3.5 w-3.5" /> We'll cover through your meals
		</p>
		<ul class="mt-2 space-y-2">
			{#each guidance.coveredByMeals as item (item.nutrient)}
				<li class="text-sm">
					<span class="font-medium text-foreground">{item.nutrient}</span>
					<span class="text-muted-foreground"> — {item.detail}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-4 rounded-xl bg-warning/10 px-4 py-3">
		<p
			class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[oklch(0.45_0.1_80)] dark:text-warning"
		>
			<Pill class="h-3.5 w-3.5" /> Consider supplementing
		</p>
		<ul class="mt-2 space-y-2">
			{#each guidance.supplement as item (item.nutrient)}
				<li class="text-sm">
					<span class="font-medium text-foreground">{item.nutrient}</span>
					<span class="text-muted-foreground"> — {item.detail}</span>
				</li>
			{/each}
		</ul>
	</div>

	<p class="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
		<AlertCircle class="mt-0.5 h-3.5 w-3.5 shrink-0" />
		General guidance only — not medical advice. Check with a healthcare provider for your personal needs.
	</p>
</Card>
