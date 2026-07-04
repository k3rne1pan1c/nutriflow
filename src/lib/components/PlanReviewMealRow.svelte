<script lang="ts">
	import type { MealType } from '$lib/types';
	import { mealMeta } from '$lib/meta';
	import { app } from '$lib/stores/app.svelte';
	import RecipeImage from './RecipeImage.svelte';
	import { Button } from '$lib/components/ui';
	import { ThumbsUp, ThumbsDown, RefreshCw, Clock } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		dayIndex: number;
		mealType: MealType;
		onReplace: () => void;
	};

	let { dayIndex, mealType, onReplace }: Props = $props();

	const meal = $derived(app.plan[dayIndex]?.meals.find((m) => m.mealType === mealType));
	const recipe = $derived(meal?.recipeId ? app.getRecipe(meal.recipeId) : undefined);
	const review = $derived(meal?.review);
</script>

{#if meal?.recipeId && recipe}
	<div
		class={cn(
			'rounded-2xl border bg-card p-3 transition-colors',
			review === 'liked' && 'border-success/40 bg-success/5',
			review === 'disliked' && 'border-destructive/40 bg-destructive/5',
			!review && 'border-border'
		)}
	>
		<div class="flex gap-3">
			<RecipeImage {recipe} class="h-20 w-20 shrink-0" />
			<div class="min-w-0 flex-1">
				<p class="text-xs font-medium text-muted-foreground">
					{mealMeta[mealType].emoji}
					{mealMeta[mealType].label}
				</p>
				<h3 class="truncate text-[15px] font-semibold text-foreground">{recipe.title}</h3>
				<p class="mt-0.5 text-xs text-muted-foreground">
					<Clock class="mr-1 inline h-3.5 w-3.5" />
					{recipe.prepTime + recipe.cookTime} min · {recipe.nutrition.calories} kcal
				</p>
				{#if meal.reason}
					<p class="mt-1 line-clamp-2 text-xs text-muted-foreground">{meal.reason}</p>
				{/if}
			</div>
		</div>

		<div class="mt-3 flex items-center gap-2">
			<Button
				variant={review === 'liked' ? 'default' : 'secondary'}
				size="sm"
				class="flex-1 gap-1.5"
				onclick={() =>
					app.setMealReview(dayIndex, mealType, review === 'liked' ? null : 'liked')}
			>
				<ThumbsUp class="h-4 w-4" /> Like
			</Button>
			<Button
				variant={review === 'disliked' ? 'default' : 'secondary'}
				size="sm"
				class="flex-1 gap-1.5"
				onclick={() =>
					app.setMealReview(dayIndex, mealType, review === 'disliked' ? null : 'disliked')}
			>
				<ThumbsDown class="h-4 w-4" /> Pass
			</Button>
			<Button variant="secondary" size="sm" class="gap-1.5" onclick={onReplace}>
				<RefreshCw class="h-4 w-4" />
				<span class="sr-only sm:not-sr-only">Replace</span>
			</Button>
		</div>
	</div>
{/if}
