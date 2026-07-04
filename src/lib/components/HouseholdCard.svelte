<script lang="ts">
	import type { HouseholdMember } from '$lib/types';
	import { Switch, Badge } from '$lib/components/ui';
	import { Trash2, Pencil } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		member: HouseholdMember;
		activeThisWeek?: boolean;
		onToggle?: () => void;
		onRemove?: () => void;
		onEdit?: () => void;
	};

	let { member, activeThisWeek = true, onToggle, onRemove, onEdit }: Props = $props();
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
		!activeThisWeek && 'opacity-60'
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
		<div class="flex items-center gap-2">
			<span class="text-[10px] text-muted-foreground">This week</span>
			<Switch checked={activeThisWeek} onCheckedChange={() => onToggle?.()} aria-label="Include {member.name} this week" />
		</div>
		<div class="flex gap-2">
			{#if onEdit}
				<button
					onclick={onEdit}
					aria-label="Edit {member.name}"
					class="text-muted-foreground transition-colors hover:text-foreground"
				>
					<Pencil class="h-4 w-4" />
				</button>
			{/if}
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
</div>
