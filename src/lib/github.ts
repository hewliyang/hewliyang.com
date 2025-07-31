export interface GitHubPR {
	title: string;
	html_url: string;
	state: 'open' | 'closed';
	merged_at: string | null;
	created_at: string;
	repository: string;
}

export interface GitHubIssue {
	title: string;
	html_url: string;
	state: 'open' | 'closed';
	created_at: string;
	repository: string;
}

const REPOS = [
	'berriai/litellm',
	'pydantic/pydantic-ai',
	'microsoft/markitdown',
	'anthropics/anthropic-sdk-python',
	'character-ai/prompt-poet',
	'pymupdf/RAG',
	'quarto-dev/quarto-cli'
];

async function searchGitHubItems(query: string, token: string) {
	const response = await fetch(
		`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100`,
		{
			headers: {
				Authorization: `token ${token}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	);

	if (!response.ok) {
		console.error(`GitHub Search API error: ${response.status} ${response.statusText}`);
		return { items: [] };
	}

	return response.json();
}

export async function fetchUserPRs(username: string, token: string): Promise<GitHubPR[]> {
	const allPRs: GitHubPR[] = [];

	for (const repo of REPOS) {
		try {
			console.log(`Searching PRs for ${repo}...`);
			const query = `repo:${repo} type:pr author:${username}`;
			const result = await searchGitHubItems(query, token);

			console.log(`${repo}: Found ${result.items.length} PRs by ${username}`);

			if (result.items.length > 0) {
				console.log(`${repo}: User's PRs:`, result.items.map((pr: any) => pr.title).slice(0, 5));
			}

			const formattedPRs = result.items.map((pr: any) => ({
				title: pr.title,
				html_url: pr.html_url,
				state: pr.state,
				merged_at: pr.pull_request?.merged_at || null,
				created_at: pr.created_at,
				repository: repo
			}));

			allPRs.push(...formattedPRs);
		} catch (error) {
			console.error(`Error searching PRs for ${repo}:`, error);
		}
	}

	return allPRs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function fetchUserIssues(username: string, token: string): Promise<GitHubIssue[]> {
	const allIssues: GitHubIssue[] = [];

	for (const repo of REPOS) {
		try {
			console.log(`Searching issues for ${repo}...`);
			const query = `repo:${repo} type:issue author:${username}`;
			const result = await searchGitHubItems(query, token);

			console.log(`${repo}: Found ${result.items.length} issues by ${username}`);

			if (result.items.length > 0) {
				console.log(
					`${repo}: User's issues:`,
					result.items.map((issue: any) => issue.title).slice(0, 5)
				);
			}

			const formattedIssues = result.items.map((issue: any) => ({
				title: issue.title,
				html_url: issue.html_url,
				state: issue.state,
				created_at: issue.created_at,
				repository: repo
			}));

			allIssues.push(...formattedIssues);
		} catch (error) {
			console.error(`Error searching issues for ${repo}:`, error);
		}
	}

	return allIssues.sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);
}
