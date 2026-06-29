<script lang="ts">
	import type { Recipe } from '$lib/types';
	import { Clock, Flame, Heart } from '@lucide/svelte';
	import { Card, Badge } from '$lib/components/ui';
	import RecipeImage from './RecipeImage.svelte';
	import { app } from '$lib/stores/app.svelte';
	import { cn } from '$lib/utils';

	type Props = { recipe: Recipe };
	let { recipe }: Props = $props();
	const totalTime = $derived(recipe.prepTime + recipe.cookTime);
	const isFav = $derived(app.isFavorite(recipe.id));
</script>

<a href="/meals/{recipe.id}" class="block">
	<Card padded={false} class="h-full overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
		<div class="relative">
			<RecipeImage {recipe} rounded="rounded-none" class="h-32 w-full" />
			<button
				onclick={(e) => {
					e.preventDefault();
					app.toggleFavorite(recipe.id);
				}}
				aria-label="Toggle favorite"
				class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors"
			>
				<Heart class={cn('h-4 w-4 text-foreground', isFav && 'fill-destructive text-destructive')} />
			</button>
		</div>
		<div class="p-3.5">
			<p class="text-[11px] font-medium uppercase tracking-wide text-primary">{recipe.cuisine}</p>
			<h3 class="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
				{recipe.title}
			</h3>
			<div class="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
				<span class="inline-flex items-center gap-1"><Clock class="h-3.5 w-3.5" />{totalTime}m</span>
				<span class="inline-flex items-center gap-1"
					><Flame class="h-3.5 w-3.5" />{recipe.nutrition.calories}</span
				>
				<Badge variant="primary" class="ml-auto">{recipe.difficulty}</Badge>
			</div>
		</div>
	</Card>
</a>
