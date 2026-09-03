<script lang="ts">
	import './layout.css';
	import '@fontsource-variable/figtree';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';
	import figtreeLatin from '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2?url';
	import spaceGroteskLatin from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url';
	import ibmPlexMonoLatin400 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url';
	import ibmPlexMonoLatin500 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2?url';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Check if we're on a specific note page - it handles its own layout with ToC
	let isNotePage = $derived($page.url.pathname.match(/^\/notes\/[^/]+$/));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" href={figtreeLatin} as="font" type="font/woff2" crossorigin="anonymous" />
	<link
		rel="preload"
		href={spaceGroteskLatin}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href={ibmPlexMonoLatin400}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href={ibmPlexMonoLatin500}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

{#if isNotePage}
	<!-- Note pages handle their own layout with ToC sidebar -->
	{@render children()}
	<Nav />
{:else}
	<!-- Standard layout with Nav sidebar -->
	<div class="mx-auto max-w-6xl px-6 py-16 pb-20 lg:pb-16">
		<div class="mx-auto max-w-2xl lg:flex lg:max-w-none lg:justify-center lg:gap-16">
			<div class="w-full max-w-2xl min-w-0">
				{@render children()}
			</div>
			<Nav />
		</div>
	</div>
{/if}
