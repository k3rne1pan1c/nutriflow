<script lang="ts">
	import type { HouseholdMember } from '$lib/types';
	import { Switch, Badge } from '$lib/components/ui';
	import { Trash2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		member: HouseholdMember;
		onToggle?: () => void;
		onRemove?: () => void;
	};

	let { member, onToggle, onRemove }: Props = $props();
	const initials = $derived(
		member.name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);
</script>

<div
	class={cn(
		'flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-opacity',
		!member.enabled && 'opacity-60'
	)}
>
	<div
		class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
		style="background:{member.avatarColor}"
	>
		{initials}
	</div>
	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<p class="truncate font-semibold text-foreground">{member.name}</p>
			<Badge variant="outline">{member.relation}</Badge>
		</div>
		<p class="mt-0.5 truncate text-xs text-muted-foreground">
			{member.age} yrs · {member.diet} · {member.activity}
		</p>
		{#if member.allergies.length}
			<p class="mt-0.5 truncate text-xs text-destructive/80">
				Allergies: {member.allergies.join(', ')}
			</p>
		{/if}
	</div>
	<div class="flex flex-col items-end gap-2">
		<Switch checked={member.enabled} onCheckedChange={() => onToggle?.()} aria-label="Toggle {member.name}" />
		{#if !member.isPrimary && onRemove}
			<button
				onclick={onRemove}
				aria-label="Remove {member.name}"
				class="text-muted-foreground transition-colors hover:text-destructive"
			>
				<Trash2 class="h-4 w-4" />
			</button>
		{/if}
	</div>
</div>
