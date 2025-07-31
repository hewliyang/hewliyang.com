<script lang="ts">
	import * as config from '$lib/config';
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="pt-6">
	<div class="space-y-4">
		<h1 class="text-xl font-bold tracking-tight">Hello, I'm Li Yang.</h1>
		<p class="text-base leading-relaxed text-muted-foreground">
			Welcome to my corner of the internet. I'm a software engineer passionate about building
			elegant solutions and sharing knowledge through writing. Here you'll find my thoughts on
			technology, code, and the occasional deep dive into interesting problems I've encountered.
		</p>
	</div>
</div>

<a
	href="/blog"
	class="font-medium underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
>
	read my blog ↗
</a>
<a
	href="/resume"
	class="font-medium underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
>
	view my resume ↗
</a>
