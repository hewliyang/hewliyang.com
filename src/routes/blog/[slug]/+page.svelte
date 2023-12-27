<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="space-y-6 pt-6">
	<hgroup>
		<h1 class="text-xl font-semibold">{data.meta.title}</h1>
		<p class="text-foreground/75">{formatDate(data.meta.date)}</p>
	</hgroup>

	<Separator />

	<div class="prose prose-quoteless prose-zinc dark:prose-invert">
		<svelte:component this={data.content} class="prose dark:prose-invert" />
	</div>
</article>
