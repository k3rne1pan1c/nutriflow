<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Leaf, ArrowRight, Sparkles, ShoppingBasket, Users } from '@lucide/svelte';
	import { fly, fade } from 'svelte/transition';

	const highlights = [
		{ icon: Sparkles, text: 'AI-planned weeks' },
		{ icon: Users, text: 'Whole household' },
		{ icon: ShoppingBasket, text: 'Zero-waste lists' }
	];
</script>

<div class="relative flex min-h-dvh flex-col overflow-hidden bg-background">
	<!-- ambient background -->
	<div
		class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[oklch(0.8_0.12_200)]/20 blur-3xl"
	></div>

	<div class="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-12">
		<div class="flex items-center gap-2" in:fade={{ duration: 500 }}>
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
				<Leaf class="h-5 w-5" />
			</div>
			<span class="text-lg font-semibold tracking-tight">NutriFlow</span>
		</div>

		<div class="flex flex-1 flex-col justify-center">
			<div in:fly={{ y: 20, duration: 600, delay: 100 }}>
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
				>
					<Sparkles class="h-3.5 w-3.5" /> Your personal nutrition assistant
				</span>
				<h1 class="mt-5 text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-foreground">
					Healthy eating<br />without thinking.
				</h1>
				<p class="mt-4 text-base leading-relaxed text-muted-foreground">
					NutriFlow designs your week of meals around your goals, your kitchen and what's fresh
					nearby — then builds the shopping list for you.
				</p>
			</div>

			<div class="mt-8 flex flex-col gap-2.5" in:fly={{ y: 20, duration: 600, delay: 250 }}>
				{#each highlights as h (h.text)}
					<div class="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm">
						<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<h.icon class="h-4.5 w-4.5" />
						</div>
						<span class="text-sm font-medium text-foreground">{h.text}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-8" in:fly={{ y: 20, duration: 600, delay: 400 }}>
			<Button href="/onboarding" size="lg" class="w-full gap-2 text-base">
				Get Started <ArrowRight class="h-5 w-5" />
			</Button>
			<a
				href="/dashboard"
				class="mt-3 block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
			>
				Skip to demo
			</a>
		</div>
	</div>
</div>
