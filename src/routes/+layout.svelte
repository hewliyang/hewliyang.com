<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Check if we're on a specific note page - it handles its own layout with ToC
	let isNotePage = $derived($page.url.pathname.match(/^\/notes\/[^/]+$/));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isNotePage}
	<!-- Note pages handle their own layout with ToC sidebar -->
	{@render children()}
	<Nav />
{:else}
	<!-- Standard layout with Nav sidebar -->
	<div class="mx-auto max-w-6xl px-6 py-16 pb-24 lg:pb-16">
		<div class="mx-auto max-w-2xl lg:flex lg:max-w-none lg:justify-center lg:gap-16">
			<div class="w-full max-w-2xl min-w-0">
				{@render children()}
			</div>
			<Nav />
		</div>
	</div>
{/if}
