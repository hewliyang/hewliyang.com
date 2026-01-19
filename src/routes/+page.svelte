<script lang="ts">
	import BrightriverLogo from '$lib/components/BrightriverLogo.svelte';
	import GithubActivity from '$lib/components/GithubActivity.svelte';
	import GicLogo from '$lib/components/GicLogo.svelte';
	import NusLogo from '$lib/components/NusLogo.svelte';
	import RegionMap from '$lib/components/RegionMap.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import X from '$lib/components/X.svelte';
	import { Github, Mail } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { data } = $props();

	type TimelineVariant = 'past' | 'current';

	const contactLinks = [
		{
			href: 'mailto:hewliyang@gmail.com',
			icon: Mail,
			label: 'hewliyang@gmail.com',
			external: false
		},
		{ href: 'https://github.com/hewliyang', icon: Github, label: 'hewliyang', external: true },
		{ href: 'https://x.com/hewliyang', icon: X, label: '@hewliyang', external: true }
	] as const;
</script>

{#snippet timelineBadge(label: string, variant: TimelineVariant = 'past')}
	<span
		class="justify-self-end rounded px-2 py-0.5 font-mono text-xs whitespace-nowrap {variant ===
		'current'
			? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
			: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'}"
	>
		{label}
	</span>
{/snippet}

{#snippet timelineDot(variant: TimelineVariant = 'past')}
	{#if variant === 'current'}
		<div
			class="relative z-10 h-2.5 w-2.5 justify-self-center rounded-full bg-amber-500 ring-4 ring-amber-500/20 dark:ring-amber-500/30"
		>
			<div class="absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-75"></div>
		</div>
	{:else}
		<div
			class="z-10 h-2.5 w-2.5 justify-self-center rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
		></div>
	{/if}
{/snippet}

{#snippet timelineItem(label: string, content: Snippet, variant: TimelineVariant = 'past')}
	<div class="grid grid-cols-[96px_16px_1fr] items-center gap-2">
		{@render timelineBadge(label, variant)}
		{@render timelineDot(variant)}
		<p class="text-sm text-neutral-600 dark:text-neutral-400">
			{@render content()}
		</p>
	</div>
{/snippet}

{#snippet contactLink(link: (typeof contactLinks)[number])}
	<a
		href={link.href}
		target={link.external ? '_blank' : undefined}
		rel={link.external ? 'noopener noreferrer' : undefined}
		class="inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
	>
		<link.icon size={16} />
		{link.label}
	</a>
{/snippet}

<svelte:head>
	<title>Li Yang</title>
	<meta name="description" content="Li Yang - Software Engineer" />
</svelte:head>

{#snippet gicContent()}
	Search, classifiers & RAG at <GicLogo class="mb-0.5 inline-block h-4 w-4 align-middle" />
	<span class="font-medium text-neutral-900 dark:text-neutral-100">GIC</span>
{/snippet}

{#snippet nusContent()}
	Graduated from <NusLogo class="mb-0.5 inline-block h-4 w-4 align-middle" />
	<span class="font-medium text-neutral-900 dark:text-neutral-100">NUS</span>
{/snippet}

{#snippet brightriverContent()}
	Engineer #0 at <BrightriverLogo /> ; infra, agents, UI, ops, r&d
{/snippet}

<div class="space-y-8">
	<!-- Header -->
	<header class="space-y-6">
		<Welcome />

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
			<!-- Left column: intro content -->
			<div class="space-y-6">
				<p class="text-neutral-600 dark:text-neutral-400">I'm Li Yang. Some history:</p>

				<!-- Timeline -->
				<div class="relative space-y-3">
					<!-- Vertical line -->
					<div
						class="absolute top-2 bottom-2 left-[112px] z-0 w-px bg-neutral-200 dark:bg-neutral-700"
					></div>

					{@render timelineItem('GPT-3.5/4', gicContent)}
					{@render timelineItem('2024', nusContent)}
					{@render timelineItem('Sonnet 3.5', brightriverContent, 'current')}
				</div>

				<p class="text-neutral-600 dark:text-neutral-400">
					I like building tools that make my life (and the lives of people around me) easier. These
					days, that means agents.
				</p>
			</div>

			<!-- Right column: map -->
			<div class="mt-4 flex justify-center sm:mt-0">
				<RegionMap />
			</div>
		</div>
	</header>

	<!-- Contact -->
	<section class="space-y-3">
		<h3 class="text-sm font-medium text-neutral-900 dark:text-neutral-100">Get in touch</h3>
		<div class="flex flex-wrap items-center gap-4">
			{#each contactLinks as link (link.href)}
				{@render contactLink(link)}
			{/each}
		</div>
	</section>

	<!-- GitHub Activity -->
	<GithubActivity prs={data.github.prs} issues={data.github.issues} />
</div>
