<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { LayoutDashboard, Users, ChefHat, ArrowLeft } from '@lucide/svelte';

	let { children } = $props();

	const nav = [
		{ href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
		{ href: '/admin/users', label: 'Users', icon: Users },
		{ href: '/admin/recipes', label: 'Recipes', icon: ChefHat }
	];

	function active(href: string, exact = false) {
		if (exact) return page.url.pathname === href;
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<div class="min-h-dvh bg-background">
	<header class="border-b border-border bg-card">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
			<div>
				<p class="text-xs font-medium uppercase tracking-wide text-primary">NutriFlow Admin</p>
				<h1 class="text-lg font-semibold text-foreground">Master backend</h1>
			</div>
			<a
				href="/dashboard"
				class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft class="h-4 w-4" /> Back to app
			</a>
		</div>
		<nav class="mx-auto flex max-w-6xl gap-1 px-5 pb-3">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class={cn(
						'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
						active(item.href, item.exact)
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'
					)}
				>
					<item.icon class="h-4 w-4" />
					{item.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="mx-auto max-w-6xl px-5 py-6">
		{@render children()}
	</main>
</div>
