<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import WorkCard from '$lib/components/WorkCard.svelte';
	import EducationCard from '$lib/components/EducationCard.svelte';
	import { Github } from 'lucide-svelte';
	import { educations, works, projects, title } from '$lib/config';
</script>

<svelte:head>
	<title>Resume | {title}</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<section class="flex min-h-0 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Education</h2>
		{#each educations as education}
			<EducationCard {education} />
		{/each}
	</section>
	<section class="flex min-h-0 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Work Experience</h2>
		{#each works as work}
			<WorkCard {work} />
		{/each}
	</section>
	<section class="print-force-new-page flex min-h-0 scroll-mb-16 flex-col gap-y-3">
		<h2 class="flex items-center gap-4 text-xl font-bold">Projects <Github class="h-5 w-5" /></h2>
		<div class="grid-cols-1 space-y-2 print:grid-cols-1 print:gap-2">
			{#each projects as project}
				<ProjectCard {project} />
			{/each}
		</div>
	</section>
</div>
