<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { X } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	type Props = {
		open?: boolean;
		class?: string;
		children: Snippet;
	};

	let { open = $bindable(false), class: className, children }: Props = $props();

	function close() {
		open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
		<button
			aria-label="Close dialog"
			class="absolute inset-0 bg-black/40 backdrop-blur-sm"
			onclick={close}
			transition:fade={{ duration: 180 }}
		></button>
		<div
			role="dialog"
			aria-modal="true"
			class={cn(
				'relative z-10 m-0 w-full max-w-md rounded-t-3xl bg-card p-6 shadow-xl sm:m-4 sm:rounded-3xl',
				className
			)}
			transition:scale={{ duration: 220, start: 0.96, easing: cubicOut }}
		>
			<button
				onclick={close}
				aria-label="Close"
				class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
			>
				<X class="h-5 w-5" />
			</button>
			{@render children()}
		</div>
	</div>
{/if}
