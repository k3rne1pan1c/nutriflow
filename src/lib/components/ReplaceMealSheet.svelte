<script lang="ts">
	import type { MealType } from '$lib/types';
	import { Dialog, Button } from '$lib/components/ui';
	import RecipeImage from './RecipeImage.svelte';
	import { app } from '$lib/stores/app.svelte';
	import { mealMeta } from '$lib/meta';
	import { Clock, Flame, Loader2, Sparkles, List } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		open?: boolean;
		dayIndex: number;
		mealType: MealType;
	};

	type Mode = 'browse' | 'generate';

	let { open = $bindable(false), dayIndex, mealType }: Props = $props();

	let mode = $state<Mode>('browse');
	let generating = $state(false);
	let generateError = $state('');
	let suggestion = $state<{
		recipeId: string;
		reason: string;
		source: string;
		recipe?: import('$lib/types').Recipe;
	} | null>(null);

	const options = $derived(app.getReplacementOptions(dayIndex, mealType));
	const currentMeal = $derived(app.plan[dayIndex]?.meals.find((m) => m.mealType === mealType));
	const currentRecipe = $derived(
		currentMeal?.recipeId ? app.getRecipe(currentMeal.recipeId) : undefined
	);
	const suggestedRecipe = $derived(
		suggestion?.recipe ?? (suggestion?.recipeId ? app.getRecipe(suggestion.recipeId) : undefined)
	);

	function pick(recipeId: string, reason?: string) {
		app.replaceMeal(dayIndex, mealType, recipeId, reason);
		resetAndClose();
	}

	function resetAndClose() {
		mode = 'browse';
		generating = false;
		generateError = '';
		suggestion = null;
		open = false;
	}

	async function generateSuggestion() {
		generateError = '';
		suggestion = null;
		generating = true;
		try {
			const result = await app.generateMealReplacement(dayIndex, mealType);
			suggestion = result;
			console.info('[nutriflow:client] meal-replacement', {
				source: result.source,
				recipeId: result.recipeId,
				debug: result.debug ?? '(set AI_DEBUG=true in .env for details)'
			});
			if (result.debug) console.info('[nutriflow:client] AI debug', result.debug);
		} catch (e) {
			generateError = e instanceof Error ? e.message : 'Generation failed';
		} finally {
			generating = false;
		}
	}

	function useSuggestion() {
		if (!suggestion?.recipeId) return;
		app.replaceMeal(
			dayIndex,
			mealType,
			suggestion.recipeId,
			suggestion.reason,
			suggestion.recipe
		);
		resetAndClose();
	}

	$effect(() => {
		if (!open) {
			mode = 'browse';
			generating = false;
			generateError = '';
			suggestion = null;
		}
	});

	const sourceLabel = $derived(
		suggestion?.source === 'ai'
			? 'AI picked'
			: suggestion?.source === 'mock'
				? 'Smart pick'
				: 'Fallback pick'
	);
</script>

<Dialog bind:open class="max-h-[85dvh] overflow-hidden sm:max-w-lg">
	<div class="pr-8">
		<p class="text-xs font-medium uppercase tracking-wide text-primary">
			{mealMeta[mealType].label}
		</p>
		<h2 class="mt-1 text-lg font-semibold text-foreground">Replace meal</h2>
		{#if currentRecipe}
			<p class="mt-1 text-sm text-muted-foreground">
				Instead of <span class="font-medium text-foreground">{currentRecipe.title}</span>
			</p>
		{/if}
	</div>

	<div class="mt-4 flex rounded-xl bg-muted p-1">
		<button
			type="button"
			class={cn(
				'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors',
				mode === 'browse' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
			)}
			onclick={() => (mode = 'browse')}
		>
			<List class="h-4 w-4" /> Browse meals
		</button>
		<button
			type="button"
			class={cn(
				'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors',
				mode === 'generate' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
			)}
			onclick={() => (mode = 'generate')}
		>
			<Sparkles class="h-4 w-4" /> Generate new
		</button>
	</div>

	{#if mode === 'browse'}
		<div class="mt-4 max-h-[50dvh] space-y-2 overflow-y-auto pr-1">
			{#if options.length === 0}
				<p class="rounded-2xl bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
					No other recipes match your preferences. Try <button
						type="button"
						class="font-medium text-primary underline"
						onclick={() => (mode = 'generate')}>Generate new</button
					> instead.
				</p>
			{:else}
				{#each options as recipe (recipe.id)}
					<button
						type="button"
						class="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
						onclick={() => pick(recipe.id)}
					>
						<RecipeImage {recipe} class="h-16 w-16 shrink-0" />
						<div class="min-w-0 flex-1">
							<p class="truncate font-semibold text-foreground">{recipe.title}</p>
							<div class="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
								<span class="inline-flex items-center gap-1">
									<Clock class="h-3.5 w-3.5" />
									{recipe.prepTime + recipe.cookTime} min
								</span>
								<span class="inline-flex items-center gap-1">
									<Flame class="h-3.5 w-3.5" />
									{recipe.nutrition.calories} kcal
								</span>
							</div>
							{#if recipe.tags[0]}
								<p class="mt-1 text-xs text-muted-foreground">
									{recipe.tags.slice(0, 2).join(' · ')}
								</p>
							{/if}
						</div>
					</button>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="mt-4">
			<p class="text-sm text-muted-foreground">
				We'll invent a brand-new recipe for this slot — tailored to your household, pantry, and
				the rest of your week.
			</p>

			{#if generateError}
				<p class="mt-3 text-sm text-destructive">{generateError}</p>
			{/if}

			{#if suggestion && suggestedRecipe}
				<div class="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-3">
					<p class="text-xs font-medium text-primary">{sourceLabel}</p>
					<div class="mt-2 flex gap-3">
						<RecipeImage recipe={suggestedRecipe} class="h-20 w-20 shrink-0" />
						<div class="min-w-0 flex-1">
							<p class="font-semibold text-foreground">{suggestedRecipe.title}</p>
							<p class="mt-0.5 text-xs text-muted-foreground">
								{suggestedRecipe.prepTime + suggestedRecipe.cookTime} min ·
								{suggestedRecipe.nutrition.calories} kcal
							</p>
							{#if suggestion.reason}
								<p class="mt-1 text-xs leading-relaxed text-muted-foreground">
									{suggestion.reason}
								</p>
							{/if}
						</div>
					</div>
					<div class="mt-3 flex gap-2">
						<Button class="flex-1" onclick={useSuggestion}>Use this meal</Button>
						<Button
							variant="secondary"
							class="flex-1"
							disabled={generating}
							onclick={generateSuggestion}
						>
							Try again
						</Button>
					</div>
				</div>
			{:else}
				<Button
					class="mt-4 w-full gap-2"
					disabled={generating}
					onclick={generateSuggestion}
				>
					{#if generating}
						<Loader2 class="h-4 w-4 animate-spin" /> Generating…
					{:else}
						<Sparkles class="h-4 w-4" /> Generate suggestion
					{/if}
				</Button>
			{/if}
		</div>
	{/if}

	<Button variant="secondary" class="mt-4 w-full" onclick={() => (open = false)}>Cancel</Button>
</Dialog>
