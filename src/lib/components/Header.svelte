<script lang="ts">
	import { Twitter, Github } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Theme from '$lib/components/Theme.svelte';
	import * as config from '$lib/config';
</script>

<header class="container">
	<div class="flex items-center justify-between py-4">
		<div class="flex items-center space-x-2">
			<div class="flex flex-col space-y-1 text-sm leading-none">
				<a href="/" class="text-lg font-bold">{config.title}</a>
				<span
					>data science @
					<a class="underline" target="_blank" href="https://nus.edu.sg">NUS</a>
				</span>
			</div>
		</div>

		<div class="flex items-center">
			<Button href="https://twitter.com/hewliyang" target="_blank" variant="ghost" size="icon">
				<Twitter class="h-4 w-4" />
			</Button>
			<Button href="https://github.com/hewliyang" target="_blank" variant="ghost" size="icon">
				<Github class="h-4 w-4" />
			</Button>
			<Theme />
		</div>
	</div>
</header>
