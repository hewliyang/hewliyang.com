<script lang="ts">
	export let src: string;
	export let alt: string;
</script>

<div>
	<img
		{src}
		{alt}
		class="self-center rounded-lg border border-dashed border-gray-900 dark:border-gray-300"
		loading="lazy"
	/>
</div>
