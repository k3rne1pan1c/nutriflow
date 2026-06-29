<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';

	type Props = {
		label: string;
		selected?: boolean;
		onclick?: () => void;
		icon?: string;
	};

	let { label, selected = false, onclick, icon }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	aria-pressed={selected}
	class={cn(
		'inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]',
		selected
			? 'border-transparent bg-primary text-primary-foreground shadow-sm'
			: 'border-border bg-card text-foreground hover:bg-accent'
	)}
>
	{#if icon}<span aria-hidden="true">{icon}</span>{/if}
	{label}
	{#if selected}<Check class="h-4 w-4" />{/if}
</button>
