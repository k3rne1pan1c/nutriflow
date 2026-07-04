<script lang="ts">
	import type { Recipe } from '$lib/types';
	import { Clock, Flame, Dumbbell, ChefHat, RefreshCw, Heart } from '@lucide/svelte';
	import { Card, Button, Badge } from '$lib/components/ui';
	import RecipeImage from './RecipeImage.svelte';
	import { mealMeta, difficultyColor } from '$lib/meta';
	import { app } from '$lib/stores/app.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		recipe: Recipe;
		onReplace?: () => void;
		compact?: boolean;
		reason?: string;
	};

	let { recipe, onReplace, compact = false, reason }: Props = $props();
	const totalTime = $derived(recipe.prepTime + recipe.cookTime);
	const isFav = $derived(app.isFavorite(recipe.id));
</script>

<Card padded={false} class="overflow-hidden">
	<div class="flex gap-4 p-3">
		<a href="/meals/{recipe.id}" class="shrink-0" aria-label="View {recipe.title}">
			<RecipeImage {recipe} class="h-24 w-24" />
		</a>
		<div class="flex min-w-0 flex-1 flex-col">
			<div class="flex items-start justify-between gap-2">
				<div class="min-w-0">
					<p class="text-xs font-medium text-primary">{mealMeta[recipe.mealType].label}</p>
					<a href="/meals/{recipe.id}" class="block">
						<h3 class="truncate text-[15px] font-semibold leading-tight text-foreground">
							{recipe.title}
						</h3>
					</a>
				</div>
				<button
					onclick={() => app.toggleFavorite(recipe.id)}
					aria-label="Toggle favorite"
					class="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
				>
					<Heart class={cn('h-5 w-5', isFav && 'fill-destructive text-destructive')} />
				</button>
			</div>

			<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
				<span class="inline-flex items-center gap-1"><Clock class="h-3.5 w-3.5" />{totalTime} min</span
				>
				<span class={cn('inline-flex items-center gap-1', difficultyColor[recipe.difficulty])}>
					<ChefHat class="h-3.5 w-3.5" />{recipe.difficulty}
				</span>
				<span class="inline-flex items-center gap-1"
					><Flame class="h-3.5 w-3.5" />{recipe.nutrition.calories} kcal</span
				>
				<span class="inline-flex items-center gap-1"
					><Dumbbell class="h-3.5 w-3.5" />{recipe.nutrition.protein}g</span
				>
			</div>

			{#if reason}
				<p class="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{reason}</p>
			{/if}

			{#if !compact}
				<div class="mt-3 flex items-center gap-2">
					<Button href="/meals/{recipe.id}" size="sm" class="flex-1">View Recipe</Button>
					<Button variant="secondary" size="sm" onclick={onReplace} class="gap-1.5">
						<RefreshCw class="h-4 w-4" /> Replace
					</Button>
				</div>
			{:else}
				<div class="mt-2 flex flex-wrap gap-1.5">
					{#each recipe.tags.slice(0, 2) as tag (tag)}
						<Badge variant="outline">{tag}</Badge>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</Card>
