<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		current: number;
		total: number;
	};

	let { current, total }: Props = $props();
</script>

<div class="flex items-center gap-1.5" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
	{#each Array(total) as _, i (i)}
		<span
			class={cn(
				'h-1.5 rounded-full transition-all duration-300',
				i === current ? 'w-7 bg-primary' : i < current ? 'w-4 bg-primary/50' : 'w-4 bg-muted'
			)}
		></span>
	{/each}
</div>
