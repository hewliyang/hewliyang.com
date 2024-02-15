<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import WorkCard from '$lib/components/WorkCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Github } from 'lucide-svelte';
	import { skills, educations, works, projects, title } from '$lib/config';
</script>

<svelte:head>
	<title>Resume | {title}</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<section class="flex min-h-0 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Education</h2>
		{#each educations as education}
			<div class="rounded-lg bg-card text-card-foreground">
				<div class="flex flex-col space-y-1.5">
					<div class="flex items-center justify-between gap-x-2 text-base">
						<h3 class="font-semibold leading-none">{education.university}</h3>
						<div class="text-sm tabular-nums text-gray-500">{education.from} - {education.to}</div>
					</div>
				</div>
				<div class="mt-2 text-pretty font-mono text-sm text-muted-foreground">
					{education.degree}
				</div>
			</div>
		{/each}
	</section>
	<section class="flex min-h-0 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Skills</h2>
		<div class="flex flex-wrap gap-1">
			{#each skills as skill}
				<Badge class="font-mono">{skill}</Badge>
			{/each}
		</div>
	</section>
	<section class="flex min-h-0 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Work Experience</h2>
		{#each works as work}
			<WorkCard {work} />
		{/each}
	</section>
	<section class="print-force-new-page flex min-h-0 scroll-mb-16 flex-col gap-y-3">
		<h2 class="flex items-center gap-4 text-xl font-bold">Projects <Github class="h-6 w-6" /></h2>
		<div class="grid grid-cols-1 gap-3 print:grid-cols-2 print:gap-2 md:grid-cols-2 lg:grid-cols-2">
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	</section>
</div>
