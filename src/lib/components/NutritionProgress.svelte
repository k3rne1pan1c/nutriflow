<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		score: number;
		size?: number;
		stroke?: number;
		label?: string;
		subtitle?: string;
		class?: string;
	};

	let { score, size = 120, stroke = 10, label = 'Balance', subtitle, class: className }: Props = $props();

	const radius = $derived((size - stroke) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference - (Math.min(score, 100) / 100) * circumference);
	const color = $derived(
		score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--primary)' : 'var(--warning)'
	);
</script>

<div class={cn('relative inline-flex items-center justify-center', className)} style="width:{size}px;height:{size}px">
	<svg width={size} height={size} class="-rotate-90">
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--muted)"
			stroke-width={stroke}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			style="transition: stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)"
		/>
	</svg>
	<div class="absolute flex flex-col items-center px-1 text-center">
		<span class="text-2xl font-semibold tabular-nums text-foreground">{score}</span>
		<span class="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
		{#if subtitle}
			<span class="mt-0.5 text-[9px] leading-tight text-muted-foreground">{subtitle}</span>
		{/if}
	</div>
</div>
