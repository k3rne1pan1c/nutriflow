<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
				outline: 'border border-border bg-card text-foreground hover:bg-accent',
				ghost: 'text-foreground hover:bg-accent',
				destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
				link: 'text-primary underline-offset-4 hover:underline rounded-md'
			},
			size: {
				default: 'h-11 px-5',
				sm: 'h-9 px-4 text-sm',
				lg: 'h-13 px-7 text-base',
				icon: 'h-11 w-11',
				pill: 'h-10 px-4 text-sm'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		href?: string;
		children: Snippet;
	} & HTMLButtonAttributes &
		HTMLAnchorAttributes;

	let {
		variant = 'default',
		size = 'default',
		class: className,
		href,
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children()}
	</a>
{:else}
	<button class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children()}
	</button>
{/if}
