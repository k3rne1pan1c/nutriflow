<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		class?: string;
		id?: string;
	};

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		class: className,
		id
	}: Props = $props();

	let percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={cn('relative flex h-6 w-full items-center', className)}>
	<div class="absolute h-2 w-full rounded-full bg-input"></div>
	<div class="absolute h-2 rounded-full bg-primary" style="width: {percent}%"></div>
	<div
		class="pointer-events-none absolute z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-primary bg-white shadow-md"
		style="left: {percent}%"
	></div>
	<input
		{id}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		class="absolute h-6 w-full cursor-pointer appearance-none bg-transparent opacity-0"
	/>
</div>
