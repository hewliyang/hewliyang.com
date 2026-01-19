<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Notes | Li Yang</title>
	<meta name="description" content="Unpolished thoughts on software, AI, and whatever else." />
</svelte:head>

<div class="space-y-8">
	<header class="space-y-4">
		<h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Notes</h1>
		<p class="text-neutral-600 dark:text-neutral-400">
			Unpolished thoughts on software, AI, and whatever else catches my interest.
		</p>
	</header>

	<div class="space-y-6">
		{#each data.posts as post}
			<article>
				<a href="/notes/{post.slug}" class="group block space-y-2">
					<h2
						class="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-neutral-100 dark:group-hover:text-neutral-300"
					>
						{post.title}
					</h2>
					<p class="text-sm text-neutral-600 dark:text-neutral-400">
						{post.description}
					</p>
					<time class="block text-xs text-neutral-500 dark:text-neutral-500">
						{new Date(post.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
				</a>
			</article>
		{/each}
	</div>

	{#if data.posts.length === 0}
		<p class="text-neutral-500 dark:text-neutral-400">No posts yet. Check back soon!</p>
	{/if}
</div>
