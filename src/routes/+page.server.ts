import { fetchUserPRs, fetchUserIssues, type GitHubPR, type GitHubIssue } from '$lib/github';
import { GITHUB_PAT } from '$env/static/private';

export interface GitHubData {
	prs: GitHubPR[];
	issues: GitHubIssue[];
}

export interface PageServerData {
	github: GitHubData;
}

export async function load(): Promise<PageServerData> {
	const username = 'hewliyang';

	try {
		const [prs, issues] = await Promise.all([
			fetchUserPRs(username, GITHUB_PAT),
			fetchUserIssues(username, GITHUB_PAT)
		]);

		console.log(`Found ${prs.length} PRs and ${issues.length} issues for user: ${username}`);
		if (prs.length > 0) console.log('PRs:', prs.map((pr) => pr.title).slice(0, 3));
		if (issues.length > 0) console.log('Issues:', issues.map((issue) => issue.title).slice(0, 3));

		return {
			github: {
				prs,
				issues
			}
		};
	} catch (error) {
		console.error('Error fetching GitHub data:', error);
		return {
			github: {
				prs: [],
				issues: []
			}
		};
	}
}
