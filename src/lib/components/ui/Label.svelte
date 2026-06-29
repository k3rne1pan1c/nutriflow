<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		children: Snippet;
	} & HTMLLabelAttributes;

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('mb-1.5 block text-sm font-medium text-foreground', className)} {...rest}>
	{@render children()}
</label>
