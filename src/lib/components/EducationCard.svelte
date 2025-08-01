<script lang="ts">
	import type { Education } from '$lib/types';

	export let education: Education;
</script>

<div class="rounded-lg bg-card text-card-foreground">
	<div class="flex flex-col space-y-1.5">
		<div class="flex items-center justify-between gap-x-2 text-base">
			<h3 class="font-semibold leading-none">{education.university}</h3>
			<div class="text-xs tabular-nums text-gray-500">{education.from} - {education.to}</div>
		</div>
	</div>
	<div class="mt-2 text-pretty font-mono text-sm text-muted-foreground">
		{education.degree}
	</div>
	{#if education.extra}
		<div class="mt-1 text-sm text-muted-foreground">
			{@html education.extra}
		</div>
	{/if}
</div>