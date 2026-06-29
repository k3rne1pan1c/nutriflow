<script lang="ts">
	import BottomNavigation from '$lib/components/BottomNavigation.svelte';

	let { children } = $props();
</script>

<div class="min-h-dvh bg-background">
	<div class="mx-auto min-h-dvh w-full max-w-md pb-24">
		{@render children()}
	</div>
	<BottomNavigation />
</div>
