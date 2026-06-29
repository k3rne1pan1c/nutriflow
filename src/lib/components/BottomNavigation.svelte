<script lang="ts">
	import { page } from '$app/state';
	import { Home, UtensilsCrossed, ShoppingBasket, Refrigerator, User } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	const items = [
		{ href: '/dashboard', label: 'Home', icon: Home },
		{ href: '/meals', label: 'Meals', icon: UtensilsCrossed },
		{ href: '/shopping', label: 'Shopping', icon: ShoppingBasket },
		{ href: '/pantry', label: 'Pantry', icon: Refrigerator },
		{ href: '/profile', label: 'Profile', icon: User }
	];

	function isActive(href: string) {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/85 backdrop-blur-xl safe-bottom"
>
	<div class="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2">
		{#each items as item (item.href)}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				class={cn(
					'flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors',
					active ? 'text-primary' : 'text-muted-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				<item.icon class={cn('h-6 w-6 transition-transform', active && 'scale-110')} />
				<span class="text-[10px] font-medium">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>
