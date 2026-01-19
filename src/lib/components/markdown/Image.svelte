<script lang="ts">
	interface Props {
		src: string;
		alt?: string;
		title?: string;
		class?: string;
	}

	let { src, alt = '', title, class: className = '' }: Props = $props();
</script>

<figure class="my-6 {className}">
	<img
		{src}
		{alt}
		{title}
		loading="lazy"
		decoding="async"
		class="block w-full rounded"
	/>
	{#if alt || title}
		<figcaption class="text-center text-sm text-neutral-500 dark:text-neutral-400">
			{title || alt}
		</figcaption>
	{/if}
</figure>
