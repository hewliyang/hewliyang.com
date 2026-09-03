<script lang="ts">
	import type { GitHubPR, GitHubIssue } from '$lib/github';
	import { GitPullRequest, GitMerge, X, CircleDot, CheckCircle } from 'lucide-svelte';

	interface Props {
		prs: GitHubPR[];
		issues: GitHubIssue[];
	}

	let { prs, issues }: Props = $props();

	type BadgeVariant = 'merged' | 'open' | 'closed' | 'closed-issue';

	const badgeStyles: Record<BadgeVariant, string> = {
		merged: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
		open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
		closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
		'closed-issue': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
	};
</script>

{#snippet badge(variant: BadgeVariant, label: string)}
	<span
		class="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium {badgeStyles[
			variant
		]}"
	>
		{#if variant === 'merged'}
			<GitMerge size={12} />
		{:else if variant === 'open'}
			<GitPullRequest size={12} />
		{:else if variant === 'closed'}
			<X size={12} />
		{:else}
			<CheckCircle size={12} />
		{/if}
		{label}
	</span>
{/snippet}

{#snippet issueBadge(state: 'open' | 'closed')}
	<span
		class="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium {state ===
		'open'
			? badgeStyles.open
			: badgeStyles['closed-issue']}"
	>
		{#if state === 'open'}
			<CircleDot size={12} />
			open
		{:else}
			<CheckCircle size={12} />
			closed
		{/if}
	</span>
{/snippet}

{#snippet itemLink(url: string, title: string)}
	<a
		href={url}
		target="_blank"
		rel="noopener noreferrer"
		class="truncate text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
	>
		{title}
	</a>
{/snippet}

{#snippet repo(name: string)}
	<span class="truncate font-mono text-xs text-neutral-500 dark:text-neutral-500">
		{name}
	</span>
{/snippet}

{#snippet section(title: string)}
	<h4 class="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
		{title}
	</h4>
{/snippet}

{#if prs.length > 0 || issues.length > 0}
	<section class="space-y-3">
		<h3 class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
			Recent GitHub Contributions
		</h3>

		{#if prs.length > 0}
			<div class="space-y-2">
				{@render section('Pull Requests')}
				<!-- Desktop: 3-column grid -->
				<div
					class="hidden text-sm md:grid md:grid-cols-[5.5rem_1fr_14rem] md:items-center md:gap-x-3 md:gap-y-1"
				>
					{#each prs as pr}
						{@render badge(
							pr.merged_at ? 'merged' : pr.state === 'open' ? 'open' : 'closed',
							pr.merged_at ? 'merged' : pr.state
						)}
						{@render itemLink(pr.html_url, pr.title)}
						{@render repo(pr.repository)}
					{/each}
				</div>
				<!-- Mobile: stacked layout -->
				<div class="flex flex-col gap-3 text-sm md:hidden">
					{#each prs as pr}
						<div class="flex flex-col gap-1">
							<a
								href={pr.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
							>
								{pr.title}
							</a>
							<div class="flex items-center gap-2">
								{@render badge(
									pr.merged_at ? 'merged' : pr.state === 'open' ? 'open' : 'closed',
									pr.merged_at ? 'merged' : pr.state
								)}
								{@render repo(pr.repository)}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if issues.length > 0}
			<div class="space-y-2">
				{@render section('Issues')}
				<!-- Desktop: 3-column grid -->
				<div
					class="hidden text-sm md:grid md:grid-cols-[5.5rem_1fr_14rem] md:items-center md:gap-x-3 md:gap-y-1"
				>
					{#each issues as issue}
						{@render issueBadge(issue.state)}
						{@render itemLink(issue.html_url, issue.title)}
						{@render repo(issue.repository)}
					{/each}
				</div>
				<!-- Mobile: stacked layout -->
				<div class="flex flex-col gap-3 text-sm md:hidden">
					{#each issues as issue}
						<div class="flex flex-col gap-1">
							<a
								href={issue.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
							>
								{issue.title}
							</a>
							<div class="flex items-center gap-2">
								{@render issueBadge(issue.state)}
								{@render repo(issue.repository)}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
