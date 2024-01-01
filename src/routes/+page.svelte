<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as config from '$lib/config';
	import { Hand } from 'lucide-svelte';
	import { formatDate } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge';

	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<article class="space-y-4 pt-6">
	<Alert.Root>
		<Hand class="h-4 w-4" />
		<Alert.Title>Hi there!</Alert.Title>
		<Alert.Description>
			I'm Li Yang. A final year undergraduate and aspiring engineering professional with significant
			<a class="rounded-lg border border-dashed px-1 font-mono underline" href="/resume">exposure</a
			>
			to the
			<span class="font-bold">full stack</span>
			and
			<span class="font-bold">machine learning</span>
		</Alert.Description>
	</Alert.Root>

	<h2 class="font-mono text-lg tracking-tighter">Blog</h2>
	<section>
		<ul class="space-y-4">
			{#each data.posts as post}
				<li>
					<div class="mb-1 flex items-center justify-between">
						<a class="font-medium underline underline-offset-4" href="blog/{post.slug}"
							>{post.title}</a
						>
						<Badge class="text-xs tracking-tight">{formatDate(post.date)}</Badge>
					</div>
					<p class="text-muted-foreground">{post.description}</p>
				</li>
			{/each}
		</ul>
	</section>
</article>
