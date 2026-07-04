<script lang="ts">
	let { data } = $props();

	function fmtDate(iso: string) {
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-5">
	<div>
		<h2 class="text-2xl font-semibold text-foreground">Users</h2>
		<p class="mt-1 text-sm text-muted-foreground">AI usage and generated recipe counts per user.</p>
	</div>

	<div class="overflow-x-auto rounded-2xl border border-border bg-card">
		<table class="w-full min-w-[720px] text-left text-sm">
			<thead class="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
				<tr>
					<th class="px-4 py-3 font-medium">User</th>
					<th class="px-4 py-3 font-medium">AI calls</th>
					<th class="px-4 py-3 font-medium">Today</th>
					<th class="px-4 py-3 font-medium">Recipes</th>
					<th class="px-4 py-3 font-medium">Plan</th>
					<th class="px-4 py-3 font-medium">Joined</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user (user.id)}
					<tr class="border-b border-border/60 last:border-0 hover:bg-muted/30">
						<td class="px-4 py-3">
							<a href="/admin/users/{user.id}" class="block font-medium text-foreground hover:text-primary">
								{user.name}
								{#if user.isAdmin}
									<span class="ml-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">Admin</span>
								{/if}
							</a>
							<span class="text-xs text-muted-foreground">{user.email}</span>
						</td>
						<td class="px-4 py-3">{user.aiGenerations}</td>
						<td class="px-4 py-3">{user.aiGenerationsToday}</td>
						<td class="px-4 py-3">{user.recipeCount}</td>
						<td class="px-4 py-3">
							{#if user.activePlan}
								<span class="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">Active</span>
							{:else}
								<span class="text-muted-foreground">—</span>
							{/if}
						</td>
						<td class="px-4 py-3 text-muted-foreground">{fmtDate(user.createdAt)}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-8 text-center text-muted-foreground">No users yet</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
