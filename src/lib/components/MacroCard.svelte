<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		label: string;
		value: number;
		target?: number;
		unit?: string;
		color: string;
	};

	let { label, value, target, unit = 'g', color }: Props = $props();
	const percent = $derived(target ? Math.min((value / target) * 100, 100) : 100);
</script>

<div class="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
	<div class="flex items-baseline justify-between">
		<span class="text-xs font-medium text-muted-foreground">{label}</span>
		<span class="h-2.5 w-2.5 rounded-full" style="background:{color}"></span>
	</div>
	<p class="mt-1 text-xl font-semibold tabular-nums text-foreground">
		{value}<span class="text-sm font-normal text-muted-foreground">{unit}</span>
	</p>
	{#if target}
		<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
			<div
				class={cn('h-full rounded-full transition-all duration-700')}
				style="width:{percent}%;background:{color}"
			></div>
		</div>
		<p class="mt-1 text-[11px] text-muted-foreground">of {target}{unit}</p>
	{/if}
</div>
