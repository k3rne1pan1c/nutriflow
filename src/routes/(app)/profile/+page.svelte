<script lang="ts">
	import { goto } from '$app/navigation';
	import { app } from '$lib/stores/app.svelte';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';
	import { mode, setMode } from 'mode-watcher';
	import { Card, Switch, Badge, Button, Separator } from '$lib/components/ui';
	import HouseholdCard from '$lib/components/HouseholdCard.svelte';
	import AddMemberDialog from '$lib/components/AddMemberDialog.svelte';
	import {
		Target,
		Salad,
		ChefHat,
		Moon,
		Bell,
		Plus,
		UserPlus,
		ChevronRight,
		Sparkles,
		Lock,
		Droplet,
		Watch,
		Store,
		ScanBarcode,
		Camera,
		Leaf,
		MapPin,
		AlertTriangle,
		Shield
	} from '@lucide/svelte';

	let { data } = $props();

	let addOpen = $state(false);
	let editMember = $state<import('$lib/types').HouseholdMember | null>(null);

	async function signOut() {
		const supabase = createSupabaseBrowserClient();
		await supabase.auth.signOut();
		goto('/');
	}

	function editPreferences(step: number) {
		goto(`/onboarding?edit=1&step=${step}`);
	}

	function syncNotifications() {
		app.syncProfile();
	}

	const isDark = $derived(mode.current === 'dark');
	const profile = $derived(app.profile);
	const hasGoals = $derived(profile.goals.length > 0);
	const hasEquipment = $derived(profile.equipment.length > 0);
	const locationLabel = $derived(
		[profile.city, profile.region, profile.country].filter(Boolean).join(', ')
	);

	const futureFeatures = [
		{ label: 'AI Nutrition Coach', icon: Sparkles },
		{ label: 'Blood Test Integration', icon: Droplet },
		{ label: 'Wearables', icon: Watch },
		{ label: 'Local Markets', icon: Store },
		{ label: 'Barcode Scanner', icon: ScanBarcode },
		{ label: 'Fridge Scanner', icon: Camera },
		{ label: 'Seasonal Ingredients', icon: Leaf }
	];
</script>

<AddMemberDialog bind:open={addOpen} {editMember} />

<div class="px-5 pt-6">
	<!-- Profile header -->
	<div class="flex items-center gap-4">
		<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
			{(profile.name || 'You').slice(0, 1).toUpperCase()}
		</div>
		<div>
			<h1 class="text-xl font-semibold tracking-tight text-foreground">{profile.name || 'Your profile'}</h1>
			<p class="text-sm text-muted-foreground">
				{profile.diet ?? 'Diet not set'}
				{#if profile.activity}
					· {profile.activity}
				{/if}
			</p>
		</div>
	</div>

	<!-- Body & preferences -->
	<section class="mt-7">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">About you</h2>
		<div class="space-y-2.5">
			<button type="button" onclick={() => editPreferences(0)} class="w-full text-left">
				<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
					<div class="flex-1">
						<p class="text-sm font-medium text-foreground">Body metrics</p>
						<p class="text-xs text-muted-foreground">
							{#if profile.age && profile.height && profile.weight}
								{profile.age} yrs · {profile.height} cm · {profile.weight} kg · {profile.sex ?? '—'}
							{:else}
								Not set — tap to add
							{/if}
						</p>
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Card>
			</button>
			{#if profile.avoid}
				<button type="button" onclick={() => editPreferences(4)} class="w-full text-left">
					<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">Foods to avoid</p>
							<p class="text-xs text-muted-foreground">{profile.avoid}</p>
						</div>
						<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
					</Card>
				</button>
			{/if}
			{#if profile.cuisines.length > 0}
				<button type="button" onclick={() => editPreferences(6)} class="w-full text-left">
					<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">Preferred cuisines</p>
							<p class="text-xs text-muted-foreground">{profile.cuisines.join(', ')}</p>
						</div>
						<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
					</Card>
				</button>
			{/if}
		</div>
	</section>

	<!-- Preferences summary -->
	<section class="mt-7">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Preferences</h2>
		<div class="space-y-2.5">
			<button type="button" onclick={() => editPreferences(2)} class="w-full text-left">
				<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Target class="h-5 w-5" />
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-foreground">Goals</p>
						{#if hasGoals}
							<div class="mt-1 flex flex-wrap gap-1">
								{#each profile.goals.slice(0, 4) as g (g)}
									<Badge variant="primary">{g}</Badge>
								{/each}
							</div>
						{:else}
							<p class="mt-0.5 text-xs text-muted-foreground">Not set — tap to choose</p>
						{/if}
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Card>
			</button>

			<button type="button" onclick={() => editPreferences(3)} class="w-full text-left">
				<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-success/12 text-success">
						<Salad class="h-5 w-5" />
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-foreground">Dietary style</p>
						<p class="text-xs text-muted-foreground">{profile.diet ?? 'Not set — tap to choose'}</p>
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Card>
			</button>

			{#if profile.allergies.length > 0}
				<button type="button" onclick={() => editPreferences(4)} class="w-full text-left">
					<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
							<AlertTriangle class="h-5 w-5" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-foreground">Allergies</p>
							<p class="truncate text-xs text-muted-foreground">{profile.allergies.join(', ')}</p>
						</div>
						<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
					</Card>
				</button>
			{/if}

			{#if locationLabel}
				<button type="button" onclick={() => editPreferences(5)} class="w-full text-left">
					<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
							<MapPin class="h-5 w-5" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">Location</p>
							<p class="text-xs text-muted-foreground">{locationLabel}</p>
						</div>
						<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
					</Card>
				</button>
			{/if}

			<button type="button" onclick={() => editPreferences(7)} class="w-full text-left">
				<Card padded={false} class="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
						<ChefHat class="h-5 w-5" />
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-foreground">Kitchen & cooking</p>
						<p class="truncate text-xs text-muted-foreground">
							Max {profile.maxCookingTime} min
							{#if hasEquipment}
								· {profile.equipment.join(', ')}
							{/if}
						</p>
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Card>
			</button>
		</div>
	</section>

	<!-- Household -->
	<section class="mt-7">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Household</h2>
			<button onclick={() => { editMember = null; addOpen = true; }} class="flex items-center gap-1 text-sm font-medium text-primary">
				<Plus class="h-4 w-4" /> Add
			</button>
		</div>
		<div class="space-y-2.5">
			{#each app.household as member (member.id)}
				<HouseholdCard
					{member}
					activeThisWeek={app.isMemberActiveThisWeek(member)}
					onToggle={() => app.toggleMemberForWeek(member.id)}
					onEdit={() => {
						editMember = member;
						addOpen = true;
					}}
					onRemove={() => app.removeMember(member.id)}
				/>
			{/each}
		</div>
		<button
			onclick={() => { editMember = null; addOpen = true; }}
			class="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
		>
			<UserPlus class="h-4.5 w-4.5" /> Add household member
		</button>
	</section>

	<!-- Settings -->
	<section class="mt-7">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Settings</h2>
		<Card padded={false} class="divide-y divide-border/70">
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Moon class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Dark mode</span>
				<Switch checked={isDark} onCheckedChange={(c) => setMode(c ? 'dark' : 'light')} aria-label="Dark mode" />
			</div>
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Bell class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Meal reminders</span>
				<Switch
					checked={app.notifications.mealReminders}
					onCheckedChange={(c) => {
						app.notifications.mealReminders = c;
						syncNotifications();
					}}
					aria-label="Meal reminders"
				/>
			</div>
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Bell class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Shopping reminders</span>
				<Switch
					checked={app.notifications.shoppingReminders}
					onCheckedChange={(c) => {
						app.notifications.shoppingReminders = c;
						syncNotifications();
					}}
					aria-label="Shopping reminders"
				/>
			</div>
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Droplet class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Hydration reminders</span>
				<Switch
					checked={app.notifications.hydration}
					onCheckedChange={(c) => {
						app.notifications.hydration = c;
						syncNotifications();
					}}
					aria-label="Hydration reminders"
				/>
			</div>
		</Card>
	</section>

	<!-- Future features (collapsed) -->
	<details class="mt-7">
		<summary class="mb-3 cursor-pointer text-sm font-semibold uppercase tracking-wide text-muted-foreground">
			Coming later
		</summary>
		<Card padded={false} class="divide-y divide-border/70">
			{#each futureFeatures.slice(0, 3) as feature (feature.label)}
				<div class="flex items-center gap-3 p-4 opacity-50">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
						<feature.icon class="h-5 w-5" />
					</div>
					<span class="flex-1 text-sm font-medium text-foreground">{feature.label}</span>
					<Badge variant="outline" class="gap-1"><Lock class="h-3 w-3" /> Soon</Badge>
				</div>
			{/each}
		</Card>
	</details>

	{#if data.isAdmin}
		<section class="mt-7">
			<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
				Administration
			</h2>
			<a href="/admin">
				<Card class="flex items-center gap-3 p-4 transition-transform active:scale-[0.99]">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Shield class="h-5 w-5" />
					</div>
					<div class="min-w-0 flex-1">
						<p class="font-medium text-foreground">Master backend</p>
						<p class="text-xs text-muted-foreground">Users, AI usage, recipe assignments</p>
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Card>
			</a>
		</section>
	{/if}

	<Separator class="my-6" />
	<Button variant="outline" class="w-full" onclick={signOut}>Sign out</Button>
	<p class="mt-3 mb-2 text-center text-xs text-muted-foreground">NutriFlow · Prototype v0.1</p>
</div>
