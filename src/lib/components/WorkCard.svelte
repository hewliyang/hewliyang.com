<script lang="ts">
	import type { Work } from '$lib/types';

	export let work: Work;
</script>

<div class="rounded-lg bg-card text-card-foreground">
	<div class="flex flex-col space-y-1.5">
		<div class="flex items-center justify-between gap-x-2 text-base">
			<h3 class="font-semibold">{work.company}</h3>
			<div class="text-xs tabular-nums text-gray-500">{work.from} - {work.to}</div>
		</div>
	</div>
	<div class="mt-2 text-pretty text-sm text-muted-foreground">
		{work.position}
	</div>
	<div class="mt-2 text-pretty text-sm text-muted-foreground">
		{@html work.description}
	</div>
</div>
