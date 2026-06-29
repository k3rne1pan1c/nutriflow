<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import { mode, setMode } from 'mode-watcher';
	import { Card, Switch, Badge, Button, Separator } from '$lib/components/ui';
	import HouseholdCard from '$lib/components/HouseholdCard.svelte';
	import AddMemberDialog from '$lib/components/AddMemberDialog.svelte';
	import { formatCurrency } from '$lib/utils';
	import {
		Target,
		Salad,
		Wallet,
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
		Leaf
	} from '@lucide/svelte';

	let addOpen = $state(false);

	const isDark = $derived(mode.current === 'dark');
	const profile = app.profile;

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

<AddMemberDialog bind:open={addOpen} />

<div class="px-5 pt-6">
	<!-- Profile header -->
	<div class="flex items-center gap-4">
		<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
			{(profile.name || 'You').slice(0, 1).toUpperCase()}
		</div>
		<div>
			<h1 class="text-xl font-semibold tracking-tight text-foreground">{profile.name || 'Your profile'}</h1>
			<p class="text-sm text-muted-foreground">
				{profile.diet ?? 'Omnivore'} · {profile.activity ?? 'Moderate'}
			</p>
		</div>
	</div>

	<!-- Preferences summary -->
	<section class="mt-7">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Preferences</h2>
		<div class="space-y-2.5">
			<Card padded={false} class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Target class="h-5 w-5" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-foreground">Goals</p>
					<div class="mt-1 flex flex-wrap gap-1">
						{#each (profile.goals.length ? profile.goals : ['Longevity', 'Energy']).slice(0, 3) as g (g)}
							<Badge variant="primary">{g}</Badge>
						{/each}
					</div>
				</div>
				<ChevronRight class="h-5 w-5 text-muted-foreground" />
			</Card>

			<Card padded={false} class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-success/12 text-success">
					<Salad class="h-5 w-5" />
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-foreground">Dietary style</p>
					<p class="text-xs text-muted-foreground">{profile.diet ?? 'Omnivore'}</p>
				</div>
				<ChevronRight class="h-5 w-5 text-muted-foreground" />
			</Card>

			<Card padded={false} class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-[oklch(0.5_0.1_80)] dark:text-warning">
					<Wallet class="h-5 w-5" />
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-foreground">Weekly budget</p>
					<p class="text-xs text-muted-foreground">{formatCurrency(profile.weeklyBudget || 120)} · max {profile.maxCookingTime} min cooking</p>
				</div>
				<ChevronRight class="h-5 w-5 text-muted-foreground" />
			</Card>

			<Card padded={false} class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
					<ChefHat class="h-5 w-5" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-medium text-foreground">Kitchen equipment</p>
					<p class="truncate text-xs text-muted-foreground">
						{(profile.equipment.length ? profile.equipment : ['Oven', 'Blender', 'Air Fryer']).join(', ')}
					</p>
				</div>
				<ChevronRight class="h-5 w-5 text-muted-foreground" />
			</Card>
		</div>
	</section>

	<!-- Household -->
	<section class="mt-7">
		<div class="mb-3 flex items-center justify-between">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Household</h2>
			<button onclick={() => (addOpen = true)} class="flex items-center gap-1 text-sm font-medium text-primary">
				<Plus class="h-4 w-4" /> Add
			</button>
		</div>
		<div class="space-y-2.5">
			{#each app.household as member (member.id)}
				<HouseholdCard
					{member}
					onToggle={() => app.toggleMember(member.id)}
					onRemove={() => app.removeMember(member.id)}
				/>
			{/each}
		</div>
		<button
			onclick={() => (addOpen = true)}
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
				<Switch bind:checked={app.notifications.mealReminders} aria-label="Meal reminders" />
			</div>
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Bell class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Shopping reminders</span>
				<Switch bind:checked={app.notifications.shoppingReminders} aria-label="Shopping reminders" />
			</div>
			<div class="flex items-center gap-3 p-4">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
					<Droplet class="h-5 w-5" />
				</div>
				<span class="flex-1 text-sm font-medium text-foreground">Hydration reminders</span>
				<Switch bind:checked={app.notifications.hydration} aria-label="Hydration reminders" />
			</div>
		</Card>
	</section>

	<!-- Future features -->
	<section class="mt-7">
		<h2 class="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
			Coming soon
		</h2>
		<Card padded={false} class="divide-y divide-border/70">
			{#each futureFeatures as feature (feature.label)}
				<div class="flex items-center gap-3 p-4 opacity-60">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
						<feature.icon class="h-5 w-5" />
					</div>
					<span class="flex-1 text-sm font-medium text-foreground">{feature.label}</span>
					<Badge variant="outline" class="gap-1"><Lock class="h-3 w-3" /> Soon</Badge>
				</div>
			{/each}
		</Card>
	</section>

	<Separator class="my-6" />
	<Button href="/" variant="ghost" class="w-full text-muted-foreground">Restart onboarding</Button>
	<p class="mt-3 mb-2 text-center text-xs text-muted-foreground">NutriFlow · Prototype v0.1</p>
</div>
