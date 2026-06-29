<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Recipe } from '$lib/types';
	import { mealMeta } from '$lib/meta';

	type Props = {
		recipe: Recipe;
		class?: string;
		rounded?: string;
		variant?: 'card' | 'hero';
	};

	let { recipe, class: className, rounded = 'rounded-2xl', variant = 'card' }: Props = $props();

	const gradients: Record<string, string> = {
		'gradient-1': 'from-[oklch(0.78_0.11_160)] via-[oklch(0.72_0.13_190)] to-[oklch(0.65_0.14_220)]',
		'gradient-2': 'from-[oklch(0.8_0.12_120)] via-[oklch(0.72_0.14_150)] to-[oklch(0.64_0.12_170)]',
		'gradient-3': 'from-[oklch(0.78_0.12_35)] via-[oklch(0.7_0.14_25)] to-[oklch(0.62_0.12_350)]',
		'gradient-4': 'from-[oklch(0.8_0.13_140)] via-[oklch(0.72_0.14_95)] to-[oklch(0.65_0.12_75)]',
		'gradient-5': 'from-[oklch(0.82_0.11_80)] via-[oklch(0.74_0.13_55)] to-[oklch(0.66_0.11_40)]',
		'gradient-6': 'from-[oklch(0.8_0.1_60)] via-[oklch(0.72_0.12_40)] to-[oklch(0.64_0.1_30)]',
		'gradient-7': 'from-[oklch(0.78_0.12_175)] via-[oklch(0.7_0.13_220)] to-[oklch(0.62_0.11_260)]',
		'gradient-8': 'from-[oklch(0.84_0.13_95)] via-[oklch(0.76_0.14_70)] to-[oklch(0.68_0.12_50)]',
		'gradient-9': 'from-[oklch(0.8_0.11_350)] via-[oklch(0.72_0.1_310)] to-[oklch(0.64_0.09_280)]',
		'gradient-10': 'from-[oklch(0.8_0.1_50)] via-[oklch(0.72_0.11_35)] to-[oklch(0.64_0.1_25)]'
	};

	const gradient = $derived(gradients[recipe.image] ?? gradients['gradient-1']);
	const emoji = $derived(mealMeta[recipe.mealType].emoji);
	const isHero = $derived(variant === 'hero');
</script>

<div
	class={cn(
		'relative overflow-hidden bg-gradient-to-br',
		gradient,
		isHero ? 'h-full min-h-64 w-full' : 'flex items-center justify-center',
		!isHero && rounded,
		className
	)}
>
	<!-- Soft decorative shapes -->
	<div class="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl"></div>
	<div class="pointer-events-none absolute -bottom-10 -left-6 h-36 w-36 rounded-full bg-black/10 blur-2xl"></div>

	{#if isHero}
		<span
			class="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 select-none text-[9rem] leading-none opacity-[0.18] blur-[1px]"
			aria-hidden="true"
		>{emoji}</span>
		<span
			class="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 select-none text-7xl drop-shadow-md"
			aria-hidden="true"
		>{emoji}</span>
	{:else}
		<div class="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
		<span class="text-4xl drop-shadow-sm">{emoji}</span>
	{/if}
</div>
