<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { themeStore } from '$lib/stores/theme.svelte';

	$effect(() => {
		themeStore.init();
	});
</script>

<button
	onclick={() => themeStore.toggle()}
	class="cursor-pointer text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
	aria-label="Toggle theme"
	title={themeStore.current === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	<Sun size={18} class="block dark:hidden" />
	<Moon size={18} class="hidden dark:block" />
</button>
