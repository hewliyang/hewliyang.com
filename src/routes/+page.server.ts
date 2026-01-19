import { fetchGitHubData, type GitHubData } from '$lib/github';
import type { PageServerLoad } from './$types';

const CACHE_KEY = 'github-activity';
const CACHE_TTL_SECONDS = 1 * 60 * 60; // 1 hour

export const load: PageServerLoad = async ({ platform, depends }) => {
	// Mark this data as revalidatable via invalidate('github:activity')
	depends('github:activity');

	const kv = platform?.env?.GITHUB_CACHE;
	const token = platform?.env?.GITHUB_PAT;

	// Try to get from KV cache
	if (kv) {
		try {
			const cached = await kv.get<GitHubData>(CACHE_KEY, 'json');
			if (cached) {
				return { github: cached };
			}
		} catch (e) {
			console.error('KV read error:', e);
		}
	}

	// Fetch fresh data from GitHub
	const data = await fetchGitHubData(token);

	// Store in KV cache (must await in Workers or it won't complete)
	if (kv) {
		try {
			await kv.put(CACHE_KEY, JSON.stringify(data), {
				expirationTtl: CACHE_TTL_SECONDS
			});
		} catch (e) {
			console.error('KV write error:', e);
		}
	}

	return { github: data };
};
