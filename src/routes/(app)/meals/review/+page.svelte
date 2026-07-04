<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { app } from '$lib/stores/app.svelte';
	import { mealOrder } from '$lib/meta';
	import {
		countFilledMeals,
		countReviewedMeals,
		countDislikedMeals,
		planHasFilledMeals
	} from '$lib/plan/planUtils';
	import PlanReviewMealRow from '$lib/components/PlanReviewMealRow.svelte';
	import ReplaceMealSheet from '$lib/components/ReplaceMealSheet.svelte';
	import { Button } from '$lib/components/ui';
	import { ArrowRight, Sparkles } from '@lucide/svelte';
	import type { MealType } from '$lib/types';

	let replaceOpen = $state(false);
	let replaceTarget = $state<{ dayIndex: number; mealType: MealType } | null>(null);

	const total = $derived(countFilledMeals(app.plan));
	const reviewed = $derived(countReviewedMeals(app.plan));
	const disliked = $derived(countDislikedMeals(app.plan));
	const progress = $derived(total > 0 ? Math.round((reviewed / total) * 100) : 0);

	onMount(() => {
		if (!planHasFilledMeals(app.plan)) goto('/meals');
	});

	function openReplace(dayIndex: number, mealType: MealType) {
		replaceTarget = { dayIndex, mealType };
		replaceOpen = true;
	}

	function finish() {
		goto('/meals');
	}
</script>

{#if replaceTarget}
	<ReplaceMealSheet
		bind:open={replaceOpen}
		dayIndex={replaceTarget.dayIndex}
		mealType={replaceTarget.mealType}
	/>
{/if}

<div class="flex min-h-dvh flex-col px-5 pt-6 pb-28">
	<header>
		<div class="flex items-center gap-2 text-primary">
			<Sparkles class="h-5 w-5" />
			<span class="text-sm font-medium">New week generated</span>
		</div>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-foreground">Review your meals</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Like what works, pass on what doesn't — replace any meal before you commit to the week.
		</p>
	</header>

	<div class="mt-5 rounded-2xl bg-secondary px-4 py-3">
		<div class="flex items-center justify-between text-sm">
			<span class="font-medium text-secondary-foreground">{reviewed} of {total} reviewed</span>
			{#if disliked > 0}
				<span class="text-muted-foreground">{disliked} to replace</span>
			{/if}
		</div>
		<div class="mt-2 h-2 overflow-hidden rounded-full bg-muted">
			<div
				class="h-full rounded-full bg-primary transition-all duration-300"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	<div class="mt-6 space-y-8">
		{#each app.plan as day, dayIndex (day.date)}
			<section>
				<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					{day.day}
				</h2>
				<div class="space-y-3">
					{#each mealOrder as type (type)}
						<PlanReviewMealRow
							{dayIndex}
							mealType={type}
							onReplace={() => openReplace(dayIndex, type)}
						/>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<div
		class="fixed inset-x-0 bottom-16 z-30 border-t border-border/70 bg-card/90 px-5 py-4 backdrop-blur-xl safe-bottom"
	>
		<div class="mx-auto max-w-md">
			<Button class="w-full gap-2" onclick={finish}>
				Done — view meal plan
				<ArrowRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
