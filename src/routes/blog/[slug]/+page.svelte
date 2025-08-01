<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { title } from '$lib/config';
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title} | {title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
		integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
		crossorigin="anonymous"
	/>
</svelte:head>

<article class="space-y-6 pt-6">
	<hgroup>
		<h1 class="text-xl font-semibold">{data.meta.title}</h1>
		<p class="text-foreground/75">{formatDate(data.meta.date)}</p>
	</hgroup>

	<Separator />

	<div
		class="prose-quoteless prose prose-zinc max-w-none dark:prose-invert prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-inline-code:rounded prose-inline-code:border prose-inline-code:before:hidden prose-inline-code:after:hidden"
	>
		<svelte:component this={data.content} />
	</div>
</article>
