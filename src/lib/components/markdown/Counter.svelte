<script lang="ts">
	let count = $state(0);
</script>

<div
	class="not-prose my-8 flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
>
	<button
		onclick={() => count--}
		class="rounded-md bg-neutral-200 px-3 py-1 font-mono text-sm hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
	>
		-
	</button>
	<span class="font-mono text-lg">{count}</span>
	<button
		onclick={() => count++}
		class="rounded-md bg-neutral-200 px-3 py-1 font-mono text-sm hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
	>
		+
	</button>
</div>
