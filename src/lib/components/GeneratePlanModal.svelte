<script lang="ts">
	import { goto } from '$app/navigation';
	import { Dialog, Button } from '$lib/components/ui';
	import { Sparkles, Loader2 } from '@lucide/svelte';
	import { app } from '$lib/stores/app.svelte';
	import { countFilledMeals } from '$lib/plan/planUtils';
	import type { PlannedDay } from '$lib/types';

	type Props = { open?: boolean };
	let { open = $bindable(false) }: Props = $props();

	let loading = $state(false);
	let error = $state('');

	async function generate() {
		error = '';
		loading = true;
		try {
			const res = await fetch('/api/generate-plan', { method: 'POST' });
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Generation failed');

			const plan = body.plan as PlannedDay[] | undefined;
			if (!plan?.length) throw new Error('Server returned an empty plan');

			const mealCount = countFilledMeals(plan);
			if (mealCount === 0) {
				throw new Error(
					'No meals could be matched to your preferences. Try relaxing diet filters or run pnpm run seed.'
				);
			}

			if (body.planId) {
				app.setPlan(plan, body.planId, {
					skipSync: true,
					recipes: body.generatedRecipes as import('$lib/types').Recipe[] | undefined
				});
			} else {
				app.plan = structuredClone(plan);
				app.checkedShopping = [];
				if (body.generatedRecipes?.length) {
					app.mergeGeneratedRecipes(body.generatedRecipes);
				}
			}

			console.info('[nutriflow:client] generate-plan', {
				source: body.source,
				planId: body.planId,
				debug: body.debug ?? '(set AI_DEBUG=true in .env for details)'
			});
			if (body.debug) console.info('[nutriflow:client] AI debug', body.debug);

			open = false;
			goto('/meals/review');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<Dialog bind:open>
	<div class="flex flex-col items-center text-center">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
		>
			<Sparkles class="h-7 w-7" />
		</div>
		<h2 class="mt-4 text-xl font-semibold text-foreground">Generate My Week</h2>
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
			Gemini invents original recipes for your household — breakfast through snacks — using your
			diet, pantry, and goals. You'll review each meal before locking in the week.
		</p>
	</div>

	{#if error}
		<p class="mt-4 text-center text-sm text-destructive">{error}</p>
	{/if}

	<Button class="mt-6 w-full gap-2" disabled={loading} onclick={generate}>
		{#if loading}
			<Loader2 class="h-4 w-4 animate-spin" /> Generating…
		{:else}
			<Sparkles class="h-4 w-4" /> Generate My Week
		{/if}
	</Button>
</Dialog>
