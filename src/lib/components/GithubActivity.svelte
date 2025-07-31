<script lang="ts">
	import type { GitHubData } from '../../routes/+page.server';
	import { GitPullRequest, GitMerge, X, CircleDot, CheckCircle } from 'lucide-svelte';

	export let data: GitHubData;
</script>

{#if data && (data.prs.length > 0 || data.issues.length > 0)}
	<section class="space-y-3">
		<h3 class="text-sm font-medium text-foreground">Recent GitHub Contributions</h3>

		{#if data.prs.length > 0}
			<div class="space-y-2">
				<h4 class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Pull Requests
				</h4>
				<div class="space-y-1">
					{#each data.prs as pr}
						<div class="flex items-center gap-2 text-sm">
							<span
								class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
					{pr.merged_at
									? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
									: pr.state === 'open'
										? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
										: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}"
							>
								{#if pr.merged_at}
									<GitMerge size={12} />
									merged
								{:else if pr.state === 'open'}
									<GitPullRequest size={12} />
									open
								{:else}
									<X size={12} />
									closed
								{/if}
							</span>
							<a
								href={pr.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="truncate text-muted-foreground transition-colors hover:text-foreground"
							>
								{pr.title}
							</a>
							<span class="shrink-0 text-xs text-muted-foreground">
								{pr.repository.split('/')[1]}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.issues.length > 0}
			<div class="space-y-2">
				<h4 class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Issues</h4>
				<div class="space-y-1">
					{#each data.issues as issue}
						<div class="flex items-center gap-2 text-sm">
							<span
								class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
					{issue.state === 'open'
									? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
									: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'}"
							>
								{#if issue.state === 'open'}
									<CircleDot size={12} />
									open
								{:else}
									<CheckCircle size={12} />
									closed
								{/if}
							</span>
							<a
								href={issue.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="truncate text-muted-foreground transition-colors hover:text-foreground"
							>
								{issue.title}
							</a>
							<span class="shrink-0 text-xs text-muted-foreground">
								{issue.repository.split('/')[1]}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
