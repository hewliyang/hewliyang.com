<script lang="ts">
	import '../app.pcss';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import Header from '$lib/components/Header.svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />

<div class="mx-auto mb-40 mt-8 flex max-w-2xl flex-col">
	<Header />
	<main class="flex-1">
		<div class="container flex flex-col space-y-2">
			<slot />
		</div>
	</main>
</div>
