<script lang="ts">
	import type { PlannedDay } from '$lib/types';
	import { weekDays } from '$lib/meta';
	import { getTodayIndex } from '$lib/nutrition';
	import { cn } from '$lib/utils';

	type Props = {
		plan: PlannedDay[];
		selected?: number;
		dayScores?: number[];
	};

	let { plan, selected = $bindable(0), dayScores = [] }: Props = $props();
	const todayIndex = $derived(getTodayIndex(plan));
</script>

<div class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
	{#each plan as day, i (day.date)}
		{@const date = new Date(day.date).getDate()}
		{@const isToday = i === todayIndex}
		<button
			onclick={() => (selected = i)}
			class={cn(
				'relative flex h-18 w-13 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border transition-all duration-200',
				selected === i
					? 'border-transparent bg-primary text-primary-foreground shadow-sm'
					: 'border-border/70 bg-card text-muted-foreground hover:bg-accent',
				isToday && selected !== i && 'ring-2 ring-primary/40'
			)}
		>
			<span class="text-[11px] font-medium uppercase">{weekDays[i]}</span>
			<span class="text-lg font-semibold tabular-nums">{date}</span>
			{#if dayScores[i] != null && dayScores[i] >= 88}
				<span class="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-success"></span>
			{/if}
		</button>
	{/each}
</div>
