<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		value?: string;
	} & HTMLTextareaAttributes;

	let { class: className, value = $bindable(''), ...rest }: Props = $props();
</script>

<textarea
	bind:value
	class={cn(
		'flex min-h-24 w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm transition-colors',
		'placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
		'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
		className
	)}
	{...rest}
></textarea>
