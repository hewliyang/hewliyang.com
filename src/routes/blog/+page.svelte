<script lang="ts">
	import { formatDate } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge';

	export let data;
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<article class="space-y-4 pt-6">
	<h1 class="text-xl font-bold">Blog</h1>
	<section>
		<ul class="space-y-6">
			{#each data.posts as post}
				<li>
					<div class="max-w-5/8 mb-2 flex items-center justify-between md:max-w-none">
						<a class="font-medium" href="blog/{post.slug}">{post.title}</a>
						<Badge class="min-w-fit text-xs tracking-tight">{formatDate(post.date)}</Badge>
					</div>
					<p class="text-muted-foreground">{post.description}</p>
				</li>
			{/each}
		</ul>
	</section>
</article>
