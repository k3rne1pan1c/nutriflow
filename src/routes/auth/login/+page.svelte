<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Label, Card } from '$lib/components/ui';
	import { Leaf, Mail, ArrowLeft } from '@lucide/svelte';
	import { createSupabaseBrowserClient } from '$lib/supabase/client';
	import { getRememberedEmail, rememberEmail } from '$lib/auth/remember';

	let { data } = $props();

	let email = $state('');
	let loading = $state(false);
	let sent = $state(false);
	let error = $state('');

	const redirect = $derived($page.url.searchParams.get('redirect') || '/dashboard');
	const devAuth = $derived(data.devAuth ?? false);

	onMount(() => {
		const saved = getRememberedEmail();
		if (saved) email = saved;
	});

	async function devSignIn() {
		error = '';
		loading = true;
		try {
			const res = await fetch('/auth/dev-login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim() })
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body.message ?? 'Sign in failed');
			rememberEmail(email);
			await goto(redirect);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Sign in failed';
		} finally {
			loading = false;
		}
	}

	async function sendMagicLink() {
		error = '';
		loading = true;
		try {
			const supabase = createSupabaseBrowserClient();
			const { error: authError } = await supabase.auth.signInWithOtp({
				email: email.trim(),
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`
				}
			});
			if (authError) throw authError;
			rememberEmail(email);
			sent = true;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not send magic link';
		} finally {
			loading = false;
		}
	}

	function submit(e: Event) {
		e.preventDefault();
		if (devAuth) {
			void devSignIn();
		} else {
			void sendMagicLink();
		}
	}
</script>

<div class="flex min-h-dvh flex-col bg-background px-6 py-12">
	<div class="mx-auto w-full max-w-md">
		<a href="/" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
			<ArrowLeft class="h-4 w-4" /> Back
		</a>

		<div class="mt-8 flex items-center gap-2">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
				<Leaf class="h-5 w-5" />
			</div>
			<span class="text-lg font-semibold">NutriFlow</span>
		</div>

		<h1 class="mt-6 text-2xl font-semibold text-foreground">Sign in</h1>
		{#if devAuth}
			<p class="mt-2 text-sm text-muted-foreground">
				Dev mode — enter your email to sign in instantly. Your session is saved in cookies.
			</p>
		{:else}
			<p class="mt-2 text-sm text-muted-foreground">
				We'll email you a magic link — no password needed.
			</p>
		{/if}

		{#if sent && !devAuth}
			<Card class="mt-6 border-primary/20 bg-primary/5">
				<div class="flex items-start gap-3">
					<Mail class="mt-0.5 h-5 w-5 text-primary" />
					<div>
						<p class="font-medium text-foreground">Check your inbox</p>
						<p class="mt-1 text-sm text-muted-foreground">
							We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
						</p>
					</div>
				</div>
			</Card>
		{:else}
			<form class="mt-6 space-y-4" onsubmit={submit}>
				<div>
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} placeholder="you@example.com" required />
				</div>
				{#if error}
					<p class="text-sm text-destructive">{error}</p>
				{/if}
				<Button type="submit" class="w-full" disabled={loading || !email.trim()}>
					{#if loading}
						Signing in…
					{:else if devAuth}
						Sign in
					{:else}
						Send magic link
					{/if}
				</Button>
			</form>
		{/if}
	</div>
</div>
