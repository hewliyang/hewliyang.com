<script lang="ts">
	import * as config from '$lib/config';
	import type { PageData } from './$types';
	import Introduction from '$lib/components/Introduction.svelte';
	import GithubActivity from '$lib/components/GithubActivity.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="pt-6">
	<div class="space-y-4">
		<Introduction />
		<GithubActivity data={data.github} />
	</div>
	<p></p>
</div>
