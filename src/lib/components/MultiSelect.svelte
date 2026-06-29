<script lang="ts">
	import Chip from './Chip.svelte';

	type Props = {
		options: readonly string[];
		selected: string[];
		single?: boolean;
	};

	let { options, selected = $bindable([]), single = false }: Props = $props();

	function toggle(option: string) {
		if (single) {
			selected = selected.includes(option) ? [] : [option];
			return;
		}
		selected = selected.includes(option)
			? selected.filter((s) => s !== option)
			: [...selected, option];
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each options as option (option)}
		<Chip label={option} selected={selected.includes(option)} onclick={() => toggle(option)} />
	{/each}
</div>
