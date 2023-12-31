<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { skills, educations, works, projects } from '$lib/config';
</script>

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
		{/each}
	</section>
	<section class="print-force-new-page flex min-h-0 scroll-mb-16 flex-col gap-y-3">
		<h2 class="text-xl font-bold">Projects</h2>
		<div class="grid grid-cols-1 gap-3 print:grid-cols-2 print:gap-2 md:grid-cols-2 lg:grid-cols-2">
			{#each projects as { description, href, tags, title }}
				<div
					class="flex flex-col overflow-hidden rounded-lg border border-muted bg-card p-3 text-card-foreground"
				>
					<div class="flex flex-col space-y-1.5">
						<div class="space-y-1">
							<h3 class="text-base font-semibold tracking-tight">
								<a {href} target="_blank" class="inline-flex items-center gap-1 hover:underline"
									>{title}
									<span class="h-1 w-1 rounded-full bg-green-500"></span></a
								>
							</h3>
							<div class="hidden font-mono text-xs underline print:visible">{href}</div>
							<p class="font-mono text-xs text-muted-foreground">
								{description}
							</p>
						</div>
					</div>
					<div class="mt-auto flex text-pretty font-mono text-sm text-muted-foreground">
						<div class="mt-2 flex flex-wrap gap-1">
							{#each tags as tag}
								<Badge class="px-1 py-0 font-mono text-[10px]">{tag}</Badge>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
