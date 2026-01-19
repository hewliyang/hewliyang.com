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

export interface GitHubData {
	prs: GitHubPR[];
	issues: GitHubIssue[];
}

const USERNAME = 'hewliyang';

interface GitHubSearchItem {
	title: string;
	html_url: string;
	state: 'open' | 'closed';
	created_at: string;
	repository_url: string;
	pull_request?: {
		merged_at: string | null;
	};
}

async function searchGitHubItems(query: string, token?: string): Promise<GitHubSearchItem[]> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'hewliyang-portfolio'
	};

	if (token) {
		headers.Authorization = `token ${token}`;
	}

	const response = await fetch(
		`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100`,
		{ headers }
	);

	if (!response.ok) {
		console.error(`GitHub API error: ${response.status}`);
		return [];
	}

	const result = await response.json();
	return result.items || [];
}

export async function fetchGitHubData(token?: string): Promise<GitHubData> {
	try {
		const [prItems, issueItems] = await Promise.all([
			searchGitHubItems(`type:pr author:${USERNAME} -user:${USERNAME} -org:selangor-no-1`, token),
			searchGitHubItems(`type:issue author:${USERNAME} -user:${USERNAME} -org:selangor-no-1`, token)
		]);

		const prs: GitHubPR[] = prItems.map((pr) => ({
			title: pr.title,
			html_url: pr.html_url,
			state: pr.state,
			merged_at: pr.pull_request?.merged_at || null,
			created_at: pr.created_at,
			repository: pr.repository_url.replace('https://api.github.com/repos/', '')
		}));

		const issues: GitHubIssue[] = issueItems.map((issue) => ({
			title: issue.title,
			html_url: issue.html_url,
			state: issue.state,
			created_at: issue.created_at,
			repository: issue.repository_url.replace('https://api.github.com/repos/', '')
		}));

		return { prs, issues };
	} catch (error) {
		console.error('Failed to fetch GitHub activity:', error);
		return { prs: [], issues: [] };
	}
}
