export interface GitHubContribution {
    fullName: string;
    htmlUrl: string;
    stargazersCount: number;
}

export type GitHubData = GitHubContribution[];
