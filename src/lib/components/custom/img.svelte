<script lang="ts">
	export let src: string;
	export let alt: string;
</script>

<div class="flex justify-center">
	<img
		{src}
		{alt}
		class="rounded-lg border border-dashed border-gray-900 dark:border-gray-300"
		loading="lazy"
	/>
</div>
