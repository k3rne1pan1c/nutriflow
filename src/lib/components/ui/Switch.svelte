<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		checked?: boolean;
		disabled?: boolean;
		class?: string;
		'aria-label'?: string;
		onCheckedChange?: (checked: boolean) => void;
	};

	let {
		checked = $bindable(false),
		disabled = false,
		class: className,
		onCheckedChange,
		...rest
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onCheckedChange?.(checked);
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	{disabled}
	onclick={toggle}
	class={cn(
		'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
		checked ? 'bg-primary' : 'bg-input',
		className
	)}
	{...rest}
>
	<span
		class={cn(
			'inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-sm transition-transform duration-200',
			checked ? 'translate-x-5.5' : 'translate-x-1'
		)}
	></span>
</button>
