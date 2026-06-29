<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none',
		variants: {
			variant: {
				default: 'bg-secondary text-secondary-foreground',
				primary: 'bg-primary/10 text-primary',
				success: 'bg-success/12 text-success',
				warning: 'bg-warning/15 text-[oklch(0.45_0.1_80)] dark:text-warning',
				info: 'bg-info/12 text-info',
				outline: 'border border-border text-muted-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		variant?: BadgeVariant;
		class?: string;
		children: Snippet;
	};

	let { variant = 'default', class: className, children }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)}>
	{@render children()}
</span>
