<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
	};

	let { class: className, orientation = 'horizontal' }: Props = $props();
</script>

<div
	role="separator"
	class={cn(
		'bg-border',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
></div>
