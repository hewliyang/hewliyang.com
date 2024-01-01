<script lang="ts">
	import '../app.pcss';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import Header from '$lib/components/Header.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { dev } from '$app/environment';
</script>

<ModeWatcher />

<svelte:head>
	{#if !dev}
		<script>
			async
			src="https://umami.hewliyang.tech/script.js"
			data-website-id="d6998608-6fea-427f-a123-c562f07e20be"
		</script>
	{/if}
</svelte:head>

<div class="mx-auto mb-40 mt-8 flex max-w-3xl flex-col">
	<Header />
	<main class="flex-1">
		<div class="container flex flex-col space-y-2">
			<slot />
		</div>
	</main>
</div>
