<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { app } from '$lib/stores/app.svelte';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';
	import { Loader2 } from '@lucide/svelte';

	let { children, data } = $props();

	$effect(() => {
		if (!data.supabaseConfigured || !data.session?.user || !data.catalog) return;
		const supabase = createSupabaseBrowserClient();
		app.hydrate(supabase, data.session.user.id, data.catalog, data.userData ?? undefined);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>NutriFlow</title>
	<meta name="description" content="Healthy eating without thinking." />
	<meta name="theme-color" content="#0d1f17" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fbfdfb" media="(prefers-color-scheme: light)" />
</svelte:head>

<ModeWatcher />

{#if data.session && data.catalog && !app.loaded}
	<div class="flex min-h-dvh items-center justify-center bg-background">
		<Loader2 class="h-8 w-8 animate-spin text-primary" />
	</div>
{:else}
	{@render children()}
{/if}
