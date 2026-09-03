<script lang="ts">
	import TableOfContents from '$lib/components/TableOfContents.svelte';

	let { data } = $props();

	let articleEl = $state<HTMLElement | null>(null);
	let collapsed = $state(false);
</script>

{#snippet breadcrumb()}
	<nav class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
		<a href="/" class="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">
			Home
		</a>
		<span>/</span>
		<a href="/notes" class="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">
			Notes
		</a>
	</nav>
{/snippet}

<svelte:head>
	<title>{data.metadata.title} | Li Yang</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

<main class="mx-auto max-w-6xl px-6 py-16 pb-20 lg:pb-16">
	<div class="mx-auto max-w-2xl lg:flex lg:max-w-none lg:justify-center lg:gap-16">
		<!-- Main content -->
		<div class="w-full min-w-0 transition-all duration-200 {collapsed ? 'max-w-3xl' : 'max-w-2xl'}">
			<div class="space-y-8">
				<header class="space-y-4">
					{@render breadcrumb()}

					<time class="block text-sm text-neutral-500 dark:text-neutral-500">
						{new Date(data.metadata.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
				</header>

				<article bind:this={articleEl} class="prose max-w-none prose-neutral dark:prose-invert">
					<data.content />
				</article>

				<!-- Bottom navigation -->
				<footer class="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
					{@render breadcrumb()}
				</footer>
			</div>
		</div>

		<!-- ToC sidebar -->
		<TableOfContents bind:articleEl bind:collapsed />
	</div>
</main>
