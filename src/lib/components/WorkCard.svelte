<script lang="ts">
	import type { Work } from '$lib/types';

	export let work: Work;
</script>

<div class="rounded-lg bg-card text-card-foreground">
	<div class="flex flex-col space-y-1.5">
		<div class="flex items-center justify-between gap-x-2 text-base">
			<h3
				class="inline-flex items-center justify-center gap-x-1 font-semibold leading-none hover:underline"
			>
				{work.company}
			</h3>
			<div class="text-sm tabular-nums text-gray-500">{work.from} - {work.to}</div>
		</div>
		<h4 class="font-mono text-sm leading-none">{work.position}</h4>
	</div>
	<div class="mt-2 text-pretty font-mono text-xs text-muted-foreground">
		{work.description}
	</div>
</div>
