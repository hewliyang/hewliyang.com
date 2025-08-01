<script lang="ts">
	import { Github, Pencil, Scroll } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Theme from '$lib/components/Theme.svelte';
	import * as config from '$lib/config';
</script>

<header class="container">
	<div class="flex flex-col space-y-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
		<div class="flex items-center space-x-2">
			<div class="flex flex-col space-y-1 text-sm leading-none">
				<a href="/" class="text-lg font-bold">{config.title}</a>
			</div>
		</div>

		<div class="flex items-center space-x-2">
			<a href="/blog" class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				<Pencil class="mr-2 size-3" />
				<span>Blog</span>
			</a>
			<a href="/resume" class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				<Scroll class="mr-2 size-3" />
				<span>Resume</span>
			</a>
			<Button href="https://github.com/hewliyang" target="_blank" variant="outline" size="sm">
				<Github class="h-4 w-4" />
			</Button>
			<Theme />
		</div>
	</div>
</header>
