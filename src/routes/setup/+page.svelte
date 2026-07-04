<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { Leaf } from '@lucide/svelte';
</script>

<div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
	<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
		<Leaf class="h-6 w-6" />
	</div>
	<h1 class="text-xl font-semibold text-foreground">Supabase not configured</h1>
	<p class="max-w-sm text-sm text-muted-foreground">
		Copy <code class="rounded bg-muted px-1.5 py-0.5">.env.example</code> to
		<code class="rounded bg-muted px-1.5 py-0.5">.env</code> and add your Supabase project URL and anon
		key. Then run the SQL migrations and <code class="rounded bg-muted px-1.5 py-0.5">pnpm run seed</code>.
	</p>
	<Button href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
		Open Supabase dashboard
	</Button>
</div>
