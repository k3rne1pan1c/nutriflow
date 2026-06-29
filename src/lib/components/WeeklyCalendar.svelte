<script lang="ts">
	import type { PlannedDay } from '$lib/types';
	import { weekDays } from '$lib/data/mealPlan';
	import { cn } from '$lib/utils';

	type Props = {
		plan: PlannedDay[];
		selected?: number;
	};

	let { plan, selected = $bindable(0) }: Props = $props();
</script>

<div class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
	{#each plan as day, i (day.date)}
		{@const date = new Date(day.date).getDate()}
		<button
			onclick={() => (selected = i)}
			class={cn(
				'flex h-18 w-13 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border transition-all duration-200',
				selected === i
					? 'border-transparent bg-primary text-primary-foreground shadow-sm'
					: 'border-border/70 bg-card text-muted-foreground hover:bg-accent'
			)}
		>
			<span class="text-[11px] font-medium uppercase">{weekDays[i]}</span>
			<span class="text-lg font-semibold tabular-nums">{date}</span>
		</button>
	{/each}
</div>
