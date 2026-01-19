import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import type { Component } from 'svelte';

interface PostModule {
	default: Component;
	metadata: {
		title: string;
		description: string;
		date: string;
	};
}

const modules = import.meta.glob<PostModule>('/src/content/*.md', { eager: true });

export const load: PageLoad = async ({ params }) => {
	const path = `/src/content/${params.slug}.md`;
	const module = modules[path];

	if (!module) {
		error(404, 'Post not found');
	}

	return {
		content: module.default,
		metadata: module.metadata
	};
};

export const entries: EntryGenerator = () => {
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()?.replace('.md', '') ?? ''
	}));
};

export const prerender = true;
