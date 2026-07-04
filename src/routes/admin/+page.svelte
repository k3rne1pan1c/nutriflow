<script lang="ts">
	import { Card } from '$lib/components/ui';
	import { Sparkles, Users, ChefHat, Link } from '@lucide/svelte';

	let { data } = $props();
	const o = $derived(data.overview);
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold text-foreground">Overview</h2>
		<p class="mt-1 text-sm text-muted-foreground">
			Users, AI usage, and recipe library at a glance.
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Users class="h-5 w-5" />
				</div>
				<div>
					<p class="text-2xl font-semibold">{o.totalUsers}</p>
					<p class="text-sm text-muted-foreground">Users</p>
				</div>
			</div>
		</Card>
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Sparkles class="h-5 w-5" />
				</div>
				<div>
					<p class="text-2xl font-semibold">{o.totalGenerations}</p>
					<p class="text-sm text-muted-foreground">AI generations ({o.generationsToday} today)</p>
				</div>
			</div>
		</Card>
		<Card class="p-4">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<ChefHat class="h-5 w-5" />
				</div>
				<div>
					<p class="text-2xl font-semibold">{o.totalRecipes}</p>
					<p class="text-sm text-muted-foreground">{o.aiRecipes} AI · {o.totalAssignments} assigned</p>
				</div>
			</div>
		</Card>
	</div>

	<Card class="p-5">
		<h3 class="font-semibold text-foreground">Quick links</h3>
		<ul class="mt-3 space-y-2 text-sm">
			<li>
				<a href="/admin/users" class="inline-flex items-center gap-2 text-primary hover:underline">
					<Link class="h-4 w-4" /> View all users & AI usage
				</a>
			</li>
			<li>
				<a href="/admin/recipes" class="inline-flex items-center gap-2 text-primary hover:underline">
					<Link class="h-4 w-4" /> Browse recipes & assign to users
				</a>
			</li>
		</ul>
	</Card>
</div>
