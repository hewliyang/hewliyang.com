import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { markdown } from './src/lib/markdown/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Process markdown first, then handle TypeScript/other preprocessing
	preprocess: [
		markdown({
			components: {
				img: '$lib/components/markdown/Image.svelte'
			},
			theme: 'github-dark-default'
		}),
		vitePreprocess()
	],

	kit: {
		adapter: adapter()
	},

	extensions: ['.svelte', '.md']
};

export default config;
