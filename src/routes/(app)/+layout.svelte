<script lang="ts">
	import BottomNavigation from '$lib/components/BottomNavigation.svelte';
	import { app } from '$lib/stores/app.svelte';
	import { Loader2 } from '@lucide/svelte';

	let { children } = $props();
</script>

{#if !app.loaded}
	<div class="flex min-h-dvh items-center justify-center bg-background">
		<Loader2 class="h-8 w-8 animate-spin text-primary" />
	</div>
{:else if !app.catalogReady}
	<div class="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
		<p class="text-lg font-semibold text-foreground">Catalog not loaded</p>
		<p class="text-sm text-muted-foreground">
			Run <code class="rounded bg-muted px-1.5 py-0.5">pnpm run seed</code> to populate ingredients and
			recipes in Supabase.
		</p>
	</div>
{:else}
	<div class="min-h-dvh bg-background">
		<div class="mx-auto min-h-dvh w-full max-w-md pb-24">
			{@render children()}
		</div>
		<BottomNavigation />
	</div>
{/if}
