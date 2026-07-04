<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Card } from '$lib/components/ui';
	import { ArrowLeft, Shield, ShieldOff } from '@lucide/svelte';

	let { data } = $props();
	const user = $derived(data.user);

	let saving = $state(false);
	let adminError = $state('');

	async function toggleAdmin() {
		if (saving) return;
		saving = true;
		adminError = '';

		const next = !user.isAdmin;
		const res = await fetch('/api/admin/set-admin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id, isAdmin: next })
		});

		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			adminError = body.message ?? 'Failed to update admin status';
			saving = false;
			return;
		}

		await invalidateAll();
		saving = false;
	}

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleString();
	}
</script>

<div class="space-y-6">
	<a href="/admin/users" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
		<ArrowLeft class="h-4 w-4" /> All users
	</a>

	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold text-foreground">{user.name}</h2>
			<p class="text-sm text-muted-foreground">{user.email}</p>
			{#if user.isAdmin}
				<p class="mt-1 text-xs font-medium text-primary">Admin</p>
			{/if}
		</div>

		<button
			type="button"
			class="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
			disabled={saving}
			onclick={toggleAdmin}
		>
			{#if user.isAdmin}
				<ShieldOff class="h-4 w-4" />
				{saving ? 'Saving…' : 'Remove admin'}
			{:else}
				<Shield class="h-4 w-4" />
				{saving ? 'Saving…' : 'Make admin'}
			{/if}
		</button>
	</div>

	{#if adminError}
		<p class="text-sm text-destructive">{adminError}</p>
	{/if}

	<div class="grid gap-4 sm:grid-cols-3">
		<Card class="p-4">
			<p class="text-2xl font-semibold">{user.generations.length}</p>
			<p class="text-sm text-muted-foreground">AI generations (recent 50)</p>
		</Card>
		<Card class="p-4">
			<p class="text-2xl font-semibold">{user.userRecipes.length}</p>
			<p class="text-sm text-muted-foreground">Linked recipes</p>
		</Card>
		<Card class="p-4">
			<p class="text-2xl font-semibold">{user.plans.filter((p) => p.is_active).length ? 'Yes' : 'No'}</p>
			<p class="text-sm text-muted-foreground">Active meal plan</p>
		</Card>
	</div>

	<section>
		<h3 class="mb-3 text-lg font-semibold">Generated & assigned recipes</h3>
		<div class="overflow-x-auto rounded-2xl border border-border bg-card">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
					<tr>
						<th class="px-4 py-3">Title</th>
						<th class="px-4 py-3">Type</th>
						<th class="px-4 py-3">Source</th>
						<th class="px-4 py-3">When</th>
					</tr>
				</thead>
				<tbody>
					{#each user.userRecipes as r (r.recipeId)}
						<tr class="border-b border-border/60 last:border-0">
							<td class="px-4 py-3">
								<a href="/meals/{r.recipeId}" class="font-medium text-primary hover:underline">{r.title}</a>
							</td>
							<td class="px-4 py-3 capitalize">{r.mealType}</td>
							<td class="px-4 py-3">
								<span class="rounded-full bg-muted px-2 py-0.5 text-xs">{r.source}</span>
							</td>
							<td class="px-4 py-3 text-muted-foreground">{fmtDate(r.createdAt)}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="px-4 py-6 text-center text-muted-foreground">No recipes linked yet</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section>
		<h3 class="mb-3 text-lg font-semibold">Recent AI calls</h3>
		<ul class="space-y-2 text-sm">
			{#each user.generations as g (g.id)}
				<li class="rounded-xl border border-border bg-card px-4 py-2 text-muted-foreground">
					{fmtDate(g.created_at)}
				</li>
			{:else}
				<li class="text-muted-foreground">No generations recorded</li>
			{/each}
		</ul>
	</section>
</div>
