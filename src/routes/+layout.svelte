<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>NutriFlow</title>
	<meta name="description" content="Healthy eating without thinking." />
	<meta name="theme-color" content="#0d1f17" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fbfdfb" media="(prefers-color-scheme: light)" />
</svelte:head>

<ModeWatcher />

{@render children()}
