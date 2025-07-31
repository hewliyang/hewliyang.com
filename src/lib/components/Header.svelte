<script lang="ts">
	import { Github } from 'lucide-svelte';
	import { X } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import Theme from '$lib/components/Theme.svelte';
	import * as config from '$lib/config';
</script>

<header class="container">
	<div class="flex items-center justify-between py-4">
		<div class="flex items-center space-x-2">
			<div class="flex flex-col space-y-1 text-sm leading-none">
				<a href="/" class="text-lg font-bold">{config.title}</a>
			</div>
		</div>

		<div class="flex items-center">
			<Button href="https://twitter.com/hewliyang" target="_blank" variant="ghost" size="icon">
				<X class="h-4 w-4" />
			</Button>
			<Button href="https://github.com/hewliyang" target="_blank" variant="ghost" size="icon">
				<Github class="h-4 w-4" />
			</Button>
			<Theme />
		</div>
	</div>
</header>
