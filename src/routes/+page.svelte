<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';

	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<article class="space-y-4 pt-6">
	<Alert.Root>
		<Alert.Title class="text-lg">Hi there 👋</Alert.Title>
		<Alert.Description class="space-y-3 text-sm">
			<p>
				I'm Li Yang. A final year undergraduate at the National University of Singapore. I'm
				interested in software engineering, machine learning and it's applications.
			</p>
			<a href="/resume" class={buttonVariants({ variant: 'outline', class: 'w-full' })}>
				Resume &rarr;
			</a>
		</Alert.Description>
	</Alert.Root>

	<h2 class="font-mono text-lg tracking-tighter">Blog</h2>
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
