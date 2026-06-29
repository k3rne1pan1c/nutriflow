<script lang="ts">
	import { goto } from '$app/navigation';
	import { app } from '$lib/stores/app.svelte';
	import { Button, Input, Label, Slider, Textarea, Card, Badge } from '$lib/components/ui';
	import ProgressStepper from '$lib/components/ProgressStepper.svelte';
	import MultiSelect from '$lib/components/MultiSelect.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import { ingredients } from '$lib/data/ingredients';
	import {
		goalOptions,
		dietOptions,
		activityOptions,
		equipmentOptions,
		experienceOptions
	} from '$lib/meta';
	import { ArrowLeft, ArrowRight, Check, Search, Leaf, TrendingDown, TrendingUp, Minus } from '@lucide/svelte';
	import { formatCurrency } from '$lib/utils';
	import { recommendTargetWeight } from '$lib/bodyMetrics';
	import { getAllergyOptionsForDiet, stripNonVeganAllergies, buildNutrientGuidance } from '$lib/dietGuidance';
	import { getRecommendedCuisines } from '$lib/cuisineGuidance';
	import NutrientGuidanceCard from '$lib/components/NutrientGuidanceCard.svelte';
	import CuisinePicker from '$lib/components/CuisinePicker.svelte';
	import { fly } from 'svelte/transition';

	const profile = app.profile;

	const steps = [
		'About you',
		'Activity',
		'Your goals',
		'Dietary style',
		'Allergies',
		'Location',
		'Cuisines',
		'Kitchen & pantry'
	];

	let step = $state(0);
	let direction = $state(1);
	let pantrySearch = $state('');
	let targetManual = $state(false);

	const targetRecommendation = $derived(
		recommendTargetWeight(profile.height, profile.weight, profile.sex)
	);

	$effect(() => {
		if (!targetManual && targetRecommendation) {
			const next = targetRecommendation.recommended;
			if (profile.targetWeight !== next) {
				profile.targetWeight = next;
			}
		}
	});

	const sexOptions = ['Male', 'Female', 'Other'];

	const filteredIngredients = $derived(
		ingredients.filter((i) => i.name.toLowerCase().includes(pantrySearch.toLowerCase()))
	);

	const allergyOptionsForDiet = $derived(getAllergyOptionsForDiet(profile.diet));
	const isVegan = $derived(profile.diet === 'Vegan');
	const dietGuidance = $derived(buildNutrientGuidance(profile.diet));
	const locationGuidance = $derived(
		profile.country?.trim()
			? buildNutrientGuidance(profile.diet, profile.country, profile.region)
			: null
	);
	const cuisineRecommendation = $derived(
		getRecommendedCuisines(profile.country, profile.region)
	);

	function setDiet(selected: string[]) {
		profile.diet = selected[0] ?? null;
		if (profile.diet === 'Vegan') {
			profile.allergies = stripNonVeganAllergies(profile.allergies);
		}
	}

	function next() {
		if (step === 3 && profile.diet === 'Vegan') {
			profile.allergies = stripNonVeganAllergies(profile.allergies);
		}
		if (step < steps.length - 1) {
			direction = 1;
			step += 1;
		} else {
			app.onboarded = true;
			goto('/dashboard');
		}
	}

	function back() {
		if (step > 0) {
			direction = -1;
			step -= 1;
		} else {
			goto('/');
		}
	}

	function togglePantry(id: string) {
		profile.pantry = profile.pantry.includes(id)
			? profile.pantry.filter((p) => p !== id)
			: [...profile.pantry, id];
	}
</script>

<div class="flex min-h-dvh flex-col bg-background">
	<!-- Header -->
	<header class="sticky top-0 z-10 bg-background/90 px-5 pb-3 pt-5 backdrop-blur-lg">
		<div class="mx-auto flex max-w-md items-center gap-3">
			<button
				onclick={back}
				aria-label="Back"
				class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
			>
				<ArrowLeft class="h-5 w-5" />
			</button>
			<ProgressStepper current={step} total={steps.length} />
			<span class="ml-auto text-sm font-medium text-muted-foreground">{step + 1}/{steps.length}</span>
		</div>
	</header>

	<!-- Body -->
	<main class="mx-auto w-full max-w-md flex-1 px-5 pb-32 pt-2">
		{#key step}
			<div in:fly={{ x: direction * 24, duration: 280, delay: 60 }}>
				<h1 class="text-2xl font-semibold tracking-tight text-foreground">{steps[step]}</h1>

				{#if step === 0}
					<p class="mt-1 text-sm text-muted-foreground">Let's personalize your nutrition.</p>
					<div class="mt-6 space-y-4">
						<div>
							<Label for="name">Name</Label>
							<Input id="name" bind:value={profile.name} placeholder="Your name" />
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<Label for="age">Age</Label>
								<Input id="age" type="number" bind:value={profile.age} placeholder="31" />
							</div>
							<div>
								<Label>Biological sex</Label>
								<div class="flex gap-2">
									{#each sexOptions as s (s)}
										<Chip label={s} selected={profile.sex === s} onclick={() => (profile.sex = s as typeof profile.sex)} />
									{/each}
								</div>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<Label for="height">Height (cm)</Label>
								<Input id="height" type="number" bind:value={profile.height} placeholder="180" />
							</div>
							<div>
								<Label for="weight">Weight (kg)</Label>
								<Input id="weight" type="number" bind:value={profile.weight} placeholder="78" />
							</div>
						</div>
						<div>
							<Label>Target weight</Label>

							{#if targetRecommendation}
								<Card class="mt-2 border-primary/20 bg-primary/5">
									<div class="flex items-start justify-between gap-3">
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<p class="text-2xl font-semibold tabular-nums text-foreground">
													{targetManual ? profile.targetWeight : targetRecommendation.recommended}
													<span class="text-sm font-normal text-muted-foreground">kg</span>
												</p>
												{#if targetRecommendation.direction === 'lose'}
													<Badge variant="primary" class="gap-1">
														<TrendingDown class="h-3 w-3" /> Gradual loss
													</Badge>
												{:else if targetRecommendation.direction === 'gain'}
													<Badge variant="info" class="gap-1">
														<TrendingUp class="h-3 w-3" /> Gradual gain
													</Badge>
												{:else}
													<Badge variant="success" class="gap-1">
														<Minus class="h-3 w-3" /> Maintain
													</Badge>
												{/if}
											</div>
											<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
												{targetRecommendation.message}
											</p>
											<p class="mt-1.5 text-xs text-muted-foreground">
												Healthy range for your height: {targetRecommendation.healthyMin}–{targetRecommendation.healthyMax} kg
												· BMI {targetRecommendation.bmi}
											</p>
										</div>
									</div>
									{#if !targetManual}
										<button
											type="button"
											onclick={() => (targetManual = true)}
											class="mt-3 text-sm font-medium text-primary transition-colors hover:opacity-80"
										>
											Set manually instead
										</button>
									{/if}
								</Card>
							{:else}
								<p class="mt-1.5 text-sm text-muted-foreground">
									Enter your height and weight above to get a personalized target recommendation.
								</p>
							{/if}

							{#if targetManual}
								<div class="mt-3">
									<Label for="target">Your target (kg)</Label>
									<Input
										id="target"
										type="number"
										step="0.1"
										bind:value={profile.targetWeight}
										placeholder="e.g. 74"
									/>
									{#if targetRecommendation}
										<button
											type="button"
											onclick={() => {
												targetManual = false;
												profile.targetWeight = targetRecommendation.recommended;
											}}
											class="mt-2 text-sm font-medium text-primary transition-colors hover:opacity-80"
										>
											Use recommendation ({targetRecommendation.recommended} kg)
										</button>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{:else if step === 1}
					<p class="mt-1 text-sm text-muted-foreground">How active are you on a typical week?</p>
					<div class="mt-6 space-y-2.5">
						{#each activityOptions as level (level)}
							{@const desc = {
								Sedentary: 'Little to no exercise',
								Light: 'Light exercise 1-2 days',
								Moderate: 'Exercise 3-4 days',
								Active: 'Exercise 5-6 days',
								Athlete: 'Intense daily training'
							}[level]}
							<button
								onclick={() => (profile.activity = level)}
								class="flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors {profile.activity === level ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-accent'}"
							>
								<div>
									<p class="font-medium text-foreground">{level}</p>
									<p class="text-xs text-muted-foreground">{desc}</p>
								</div>
								{#if profile.activity === level}
									<div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
										<Check class="h-4 w-4" />
									</div>
								{/if}
							</button>
						{/each}
					</div>
				{:else if step === 2}
					<p class="mt-1 text-sm text-muted-foreground">Pick everything you'd like to optimize for.</p>
					<div class="mt-6">
						<MultiSelect options={goalOptions} bind:selected={profile.goals} />
					</div>
				{:else if step === 3}
					<p class="mt-1 text-sm text-muted-foreground">Choose the style that fits you best.</p>
					<div class="mt-6">
						<MultiSelect
							options={dietOptions}
							bind:selected={() => (profile.diet ? [profile.diet] : []), setDiet}
							single
						/>
					</div>
					{#if dietGuidance}
						<NutrientGuidanceCard guidance={dietGuidance} />
					{/if}
				{:else if step === 4}
					<p class="mt-1 text-sm text-muted-foreground">
						{#if isVegan}
							Select any allergies relevant to your plant-based diet.
						{:else}
							Select any allergies, then add foods to avoid.
						{/if}
					</p>
					<div class="mt-6">
						{#if isVegan}
							<p class="mb-3 text-xs text-muted-foreground">
								Animal-product allergens are hidden — your vegan diet already excludes them.
							</p>
						{/if}
						<MultiSelect options={allergyOptionsForDiet} bind:selected={profile.allergies} />
						<div class="mt-6">
							<Label for="avoid">Foods to avoid</Label>
							<Textarea id="avoid" bind:value={profile.avoid} placeholder="e.g. cilantro, blue cheese, very spicy food" />
						</div>
					</div>
				{:else if step === 5}
					<p class="mt-1 text-sm text-muted-foreground">
						Where you live helps us source local ingredients and recommend cuisines you'll actually find nearby.
					</p>
					<div class="mt-6 space-y-4">
						<div class="grid grid-cols-2 gap-3">
							<div>
								<Label for="country">Country</Label>
								<Input id="country" bind:value={profile.country} placeholder="Germany" />
							</div>
							<div>
								<Label for="region">Region</Label>
								<Input id="region" bind:value={profile.region} placeholder="Bavaria" />
							</div>
						</div>
						<div>
							<Label for="city">City</Label>
							<Input id="city" bind:value={profile.city} placeholder="Munich" />
						</div>

						{#if locationGuidance}
							<NutrientGuidanceCard guidance={locationGuidance} />
						{/if}
					</div>
				{:else if step === 6}
					<p class="mt-1 text-sm text-muted-foreground">
						{#if cuisineRecommendation}
							We picked cuisines that work well in {cuisineRecommendation.regionLabel} — or choose your own favorites below.
						{:else}
							Enter your location on the previous step for local recommendations, or pick cuisines you'd like to eat.
						{/if}
					</p>
					<div class="mt-6">
						<CuisinePicker recommendation={cuisineRecommendation} bind:selected={profile.cuisines} />
					</div>
				{:else if step === 7}
					<p class="mt-1 text-sm text-muted-foreground">Tell us about your cooking setup and pantry staples.</p>
					<div class="mt-6 space-y-6">
						<div>
							<Label>Cooking experience</Label>
							<div class="flex gap-2">
								{#each experienceOptions as exp (exp)}
									<Chip label={exp} selected={profile.experience === exp} onclick={() => (profile.experience = exp)} />
								{/each}
							</div>
						</div>
						<div>
							<Label>Available equipment</Label>
							<MultiSelect options={equipmentOptions} bind:selected={profile.equipment} />
						</div>
						<div>
							<div class="flex items-baseline justify-between">
								<Label>Maximum cooking time</Label>
								<span class="text-sm font-semibold text-primary">{profile.maxCookingTime} min</span>
							</div>
							<Slider bind:value={profile.maxCookingTime} min={10} max={60} step={5} class="mt-2" />
						</div>
						<div>
							<div class="flex items-baseline justify-between">
								<Label>Weekly budget</Label>
								<span class="text-sm font-semibold text-primary">{formatCurrency(profile.weeklyBudget)}</span>
							</div>
							<Slider bind:value={profile.weeklyBudget} min={40} max={300} step={10} class="mt-2" />
						</div>

						<div>
							<Label>Pantry staples <span class="font-normal text-muted-foreground">· always in stock</span></Label>
							<div class="relative">
								<Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input bind:value={pantrySearch} placeholder="Search ingredients" class="pl-10" />
							</div>
							<div class="no-scrollbar mt-3 flex max-h-44 flex-wrap gap-2 overflow-y-auto">
								{#each filteredIngredients as ing (ing.id)}
									<Chip
										label={ing.name}
										icon={ing.emoji}
										selected={profile.pantry.includes(ing.id)}
										onclick={() => togglePantry(ing.id)}
									/>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/key}
	</main>

	<!-- Footer -->
	<footer class="fixed inset-x-0 bottom-0 z-10 border-t border-border/60 bg-background/90 px-5 py-4 backdrop-blur-lg safe-bottom">
		<div class="mx-auto max-w-md">
			<Button onclick={next} size="lg" class="w-full gap-2">
				{#if step === steps.length - 1}
					<Leaf class="h-5 w-5" /> Finish setup
				{:else}
					Continue <ArrowRight class="h-5 w-5" />
				{/if}
			</Button>
		</div>
	</footer>
</div>
