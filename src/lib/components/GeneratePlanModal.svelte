<script lang="ts">
	import { Dialog, Button } from '$lib/components/ui';
	import { Sparkles, Lock } from '@lucide/svelte';

	type Props = { open?: boolean };
	let { open = $bindable(false) }: Props = $props();

	const factors = [
		'Health goals',
		'Household',
		'Budget',
		'Cooking time',
		'Local ingredient availability',
		'Pantry',
		'Season',
		'Nutritional optimization'
	];
</script>

<Dialog bind:open>
	<div class="flex flex-col items-center text-center">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
		>
			<Sparkles class="h-7 w-7" />
		</div>
		<h2 class="mt-4 text-xl font-semibold text-foreground">Generate Weekly Plan</h2>
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
			This will later generate a personalized meal plan using AI based on:
		</p>
	</div>

	<ul class="mt-4 grid grid-cols-2 gap-2">
		{#each factors as factor (factor)}
			<li class="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground">
				<span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
				{factor}
			</li>
		{/each}
	</ul>

	<Button disabled class="mt-6 w-full gap-2">
		<Lock class="h-4 w-4" /> Coming soon
	</Button>
	<p class="mt-3 text-center text-xs text-muted-foreground">AI generation is not available in this prototype.</p>
</Dialog>
