import type { PageServerLoad } from './$types';

export interface PostMetadata {
	title: string;
	description: string;
	date: string;
	slug: string;
}

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob<{ metadata: Omit<PostMetadata, 'slug'> }>('/src/content/*.md', {
		eager: true
	});

	const posts: PostMetadata[] = Object.entries(modules).map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		return {
			...module.metadata,
			slug
		};
	});

	// Sort by date descending
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};

export const prerender = true;
