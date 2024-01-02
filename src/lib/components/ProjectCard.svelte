<script lang="ts">
	import type { Project } from '$lib/types';
	import { Badge } from '$lib/components/ui/badge';
	export let project: Project;
</script>

<div
	class="flex flex-col overflow-hidden rounded-lg border border-muted bg-card p-3 text-card-foreground"
>
	<div class="flex flex-col space-y-1.5">
		<div class="space-y-1">
			<h3 class="text-base font-semibold tracking-tight">
				<a
					href={project.href}
					target="_blank"
					class="inline-flex items-center gap-1 hover:underline"
					>{project.title}<!-- -->
					<span class="h-1 w-1 rounded-full bg-green-500"></span></a
				>
			</h3>
			<div class="hidden font-mono text-xs underline print:visible">{project.href}</div>
			<p class="font-mono text-xs text-muted-foreground">
				{project.description}
			</p>
		</div>
	</div>
	<div class="mt-auto flex text-pretty font-mono text-sm text-muted-foreground">
		<div class="mt-2 flex flex-wrap gap-1">
			{#each project.tags as tag}
				<Badge class="px-1 py-0 font-mono text-[10px]">{tag}</Badge>
			{/each}
		</div>
	</div>
</div>
