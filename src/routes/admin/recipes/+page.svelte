<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Loader2, Send } from '@lucide/svelte';

	let { data } = $props();

	let query = $state('');
	let selectedRecipes = $state<Set<string>>(new Set());
	let selectedUsers = $state<Set<string>>(new Set());
	let assigning = $state(false);
	let message = $state('');
	let error = $state('');

	const filtered = $derived(
		data.recipes.filter((r) => {
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return (
				r.title.toLowerCase().includes(q) ||
				r.id.toLowerCase().includes(q) ||
				r.mealType.toLowerCase().includes(q)
			);
		})
	);

	function toggleRecipe(id: string) {
		const next = new Set(selectedRecipes);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedRecipes = next;
	}

	function toggleUser(id: string) {
		const next = new Set(selectedUsers);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedUsers = next;
	}

	function selectAllVisible() {
		selectedRecipes = new Set(filtered.map((r) => r.id));
	}

	function clearSelection() {
		selectedRecipes = new Set();
		selectedUsers = new Set();
	}

	async function assign() {
		error = '';
		message = '';
		if (selectedRecipes.size === 0 || selectedUsers.size === 0) {
			error = 'Select at least one recipe and one user';
			return;
		}
		assigning = true;
		try {
			const res = await fetch('/api/admin/assign-recipes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					recipeIds: [...selectedRecipes],
					userIds: [...selectedUsers]
				})
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Assignment failed');
			message = `Assigned ${body.assigned} recipe link(s). Users will see them after refresh.`;
			clearSelection();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Assignment failed';
		} finally {
			assigning = false;
		}
	}
</script>

<div class="space-y-5">
	<div>
		<h2 class="text-2xl font-semibold text-foreground">Recipes</h2>
		<p class="mt-1 text-sm text-muted-foreground">
			Select recipes and users, then assign. Users get them in their library on next load.
		</p>
	</div>

	<div class="sticky top-0 z-10 -mx-5 border-b border-border bg-background/95 px-5 py-3 backdrop-blur">
		<div class="flex flex-wrap items-center gap-3">
			<input
				type="search"
				placeholder="Search recipes…"
				bind:value={query}
				class="min-w-[200px] flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm"
			/>
			<Button variant="secondary" size="sm" onclick={selectAllVisible}>Select visible</Button>
			<Button variant="secondary" size="sm" onclick={clearSelection}>Clear</Button>
			<Button size="sm" class="gap-1.5" disabled={assigning} onclick={assign}>
				{#if assigning}
					<Loader2 class="h-4 w-4 animate-spin" />
				{:else}
					<Send class="h-4 w-4" />
				{/if}
				Assign ({selectedRecipes.size} → {selectedUsers.size})
			</Button>
		</div>
		{#if message}
			<p class="mt-2 text-sm text-success">{message}</p>
		{/if}
		{#if error}
			<p class="mt-2 text-sm text-destructive">{error}</p>
		{/if}
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr_280px]">
		<div class="overflow-x-auto rounded-2xl border border-border bg-card">
			<table class="w-full min-w-[640px] text-left text-sm">
				<thead class="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
					<tr>
						<th class="px-3 py-3 w-10"></th>
						<th class="px-3 py-3">Recipe</th>
						<th class="px-3 py-3">Type</th>
						<th class="px-3 py-3">kcal</th>
						<th class="px-3 py-3">Users</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as recipe (recipe.id)}
						<tr class="border-b border-border/60 last:border-0 hover:bg-muted/20">
							<td class="px-3 py-3">
								<input
									type="checkbox"
									checked={selectedRecipes.has(recipe.id)}
									onchange={() => toggleRecipe(recipe.id)}
								/>
							</td>
							<td class="px-3 py-3">
								<p class="font-medium text-foreground">{recipe.title}</p>
								<p class="text-xs text-muted-foreground">{recipe.id}</p>
								{#if recipe.isAi}
									<span class="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
										>AI</span
									>
								{/if}
							</td>
							<td class="px-3 py-3 capitalize">{recipe.mealType}</td>
							<td class="px-3 py-3">{recipe.calories}</td>
							<td class="px-3 py-3">{recipe.userCount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<aside class="rounded-2xl border border-border bg-card p-4">
			<h3 class="font-semibold text-foreground">Assign to users</h3>
			<p class="mt-1 text-xs text-muted-foreground">Selected users receive all checked recipes.</p>
			<ul class="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
				{#each data.users as user (user.id)}
					<label class="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-muted/50">
						<input
							type="checkbox"
							class="mt-0.5"
							checked={selectedUsers.has(user.id)}
							onchange={() => toggleUser(user.id)}
						/>
						<span class="min-w-0">
							<span class="block text-sm font-medium">{user.name}</span>
							<span class="block truncate text-xs text-muted-foreground">{user.email}</span>
						</span>
					</label>
				{/each}
			</ul>
		</aside>
	</div>
</div>
