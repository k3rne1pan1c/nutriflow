<script lang="ts">
	import { Dialog, Button, Input, Label, Switch } from '$lib/components/ui';
	import Chip from './Chip.svelte';
	import MultiSelect from './MultiSelect.svelte';
	import { goalOptions, dietOptions, activityOptions } from '$lib/meta';
	import { getAllergyOptionsForDiet, stripNonVeganAllergies, buildNutrientGuidance } from '$lib/dietGuidance';
	import NutrientGuidanceCard from './NutrientGuidanceCard.svelte';
	import { app } from '$lib/stores/app.svelte';
	import type { HouseholdMember, Sex, ActivityLevel } from '$lib/types';
	import { UserPlus } from '@lucide/svelte';

	type Props = { open?: boolean };
	let { open = $bindable(false) }: Props = $props();

	const colors = [
		'oklch(0.65 0.16 25)',
		'oklch(0.7 0.12 250)',
		'oklch(0.7 0.13 90)',
		'oklch(0.62 0.13 155)',
		'oklch(0.65 0.15 320)'
	];

	const sexOptions: Sex[] = ['Male', 'Female', 'Other'];

	let name = $state('');
	let relation = $state('Partner');
	let age = $state<number | null>(null);
	let sex = $state<Sex>('Female');
	let height = $state<number | null>(null);
	let weight = $state<number | null>(null);
	let activity = $state<ActivityLevel>('Moderate');
	let goals = $state<string[]>([]);
	let diet = $state<string[]>(['Omnivore']);
	let allergies = $state<string[]>([]);
	let avoid = $state('');
	let eatsEveryMeal = $state(true);

	const selectedDiet = $derived(diet[0] ?? 'Omnivore');
	const allergyOptionsForDiet = $derived(getAllergyOptionsForDiet(selectedDiet));
	const isVegan = $derived(selectedDiet === 'Vegan');
	const dietGuidance = $derived(buildNutrientGuidance(selectedDiet));

	function setDiet(selected: string[]) {
		diet = selected;
		if (selected[0] === 'Vegan') {
			allergies = stripNonVeganAllergies(allergies);
		}
	}

	function reset() {
		name = '';
		relation = 'Partner';
		age = null;
		sex = 'Female';
		height = null;
		weight = null;
		activity = 'Moderate';
		goals = [];
		diet = ['Omnivore'];
		allergies = [];
		avoid = '';
		eatsEveryMeal = true;
	}

	function save() {
		if (!name.trim()) return;
		const member: HouseholdMember = {
			id: `member-${Date.now()}`,
			name: name.trim(),
			relation,
			age: age ?? 30,
			sex,
			height: height ?? 170,
			weight: weight ?? 70,
			activity,
			goals,
			diet: diet[0] ?? 'Omnivore',
			allergies,
			avoid: avoid ? avoid.split(',').map((s) => s.trim()) : [],
			eatsEveryMeal,
			enabled: true,
			avatarColor: colors[app.household.length % colors.length]
		};
		app.addMember(member);
		reset();
		open = false;
	}
</script>

<Dialog bind:open class="max-h-[90vh] overflow-y-auto">
	<div class="flex items-center gap-3">
		<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
			<UserPlus class="h-5 w-5" />
		</div>
		<h2 class="text-xl font-semibold text-foreground">Add household member</h2>
	</div>

	<div class="mt-5 space-y-4">
		<div class="grid grid-cols-2 gap-3">
			<div>
				<Label for="m-name">Name</Label>
				<Input id="m-name" bind:value={name} placeholder="Name" />
			</div>
			<div>
				<Label for="m-rel">Relation</Label>
				<Input id="m-rel" bind:value={relation} placeholder="Partner" />
			</div>
		</div>

		<div class="grid grid-cols-3 gap-3">
			<div>
				<Label for="m-age">Age</Label>
				<Input id="m-age" type="number" bind:value={age} placeholder="30" />
			</div>
			<div>
				<Label for="m-h">Height</Label>
				<Input id="m-h" type="number" bind:value={height} placeholder="170" />
			</div>
			<div>
				<Label for="m-w">Weight</Label>
				<Input id="m-w" type="number" bind:value={weight} placeholder="70" />
			</div>
		</div>

		<div>
			<Label>Sex</Label>
			<div class="flex gap-2">
				{#each sexOptions as s (s)}
					<Chip label={s} selected={sex === s} onclick={() => (sex = s)} />
				{/each}
			</div>
		</div>

		<div>
			<Label>Activity level</Label>
			<div class="flex flex-wrap gap-2">
				{#each activityOptions as a (a)}
					<Chip label={a} selected={activity === a} onclick={() => (activity = a)} />
				{/each}
			</div>
		</div>

		<div>
			<Label>Diet</Label>
			<MultiSelect options={dietOptions} bind:selected={() => diet, setDiet} single />
			{#if dietGuidance}
				<NutrientGuidanceCard guidance={dietGuidance} />
			{/if}
		</div>

		<div>
			<Label>Goals</Label>
			<MultiSelect options={goalOptions} bind:selected={goals} />
		</div>

		<div>
			<Label>Allergies</Label>
			{#if isVegan}
				<p class="mb-2 text-xs text-muted-foreground">
					Animal-product allergens are hidden — a vegan diet already excludes them.
				</p>
			{/if}
			<MultiSelect options={allergyOptionsForDiet} bind:selected={allergies} />
		</div>

		<div>
			<Label for="m-avoid">Foods to avoid</Label>
			<Input id="m-avoid" bind:value={avoid} placeholder="Comma separated" />
		</div>

		<div class="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
			<div>
				<p class="text-sm font-medium text-foreground">Eats every meal</p>
				<p class="text-xs text-muted-foreground">Include in all meal calculations</p>
			</div>
			<Switch bind:checked={eatsEveryMeal} aria-label="Eats every meal" />
		</div>
	</div>

	<div class="mt-6 flex gap-2">
		<Button variant="secondary" class="flex-1" onclick={() => (open = false)}>Cancel</Button>
		<Button class="flex-1" onclick={save} disabled={!name.trim()}>Add member</Button>
	</div>
</Dialog>
