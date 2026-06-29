<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		padded?: boolean;
		children: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let { class: className, padded = true, children, ...rest }: Props = $props();
</script>

<div
	class={cn(
		'rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm',
		padded && 'p-5',
		className
	)}
	{...rest}
>
	{@render children()}
</div>
