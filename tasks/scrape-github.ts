import axios, { type AxiosError } from 'axios';
import type { GitHubData } from '../data/schema/github';
import { writeGenerated } from './io';

const githubPat = process.env.GITHUB_PAT ?? '';

const headers = {
    accept: 'application/vnd.github.v3+json',
    authorization: `token ${githubPat}`,
};

const getContributions = async () => {
    const { data } = await axios.get<{
        items: {
            html_url: string;
        }[];
    }>('https://api.github.com/search/issues', {
        headers,
        params: {
            per_page: 100,
            q: 'is:pr is:merged author:hideo54',
        },
    });
    const repoNames = new Set(
        data.items
            .map(
                item =>
                    item.html_url.match(
                        /^https:\/\/github.com\/(.+)\/pull\/\d+$/,
                    )?.[1],
            )
            .filter(name => name !== undefined),
    );
    const repos = await Promise.all(
        Array.from(repoNames).map(name =>
            axios
                .get<{
                    full_name: string;
                    html_url: string;
                    stargazers_count: number;
                }>(`https://api.github.com/repos/${name}`, { headers })
                .then(res => res.data)
                .catch((e: AxiosError) => {
                    console.warn(
                        `Skipped ${name}: ${e.response?.status ?? e.message}`,
                    );
                    return undefined;
                }),
        ),
    );
    return repos
        .filter(repo => repo !== undefined)
        .filter(repo => repo.stargazers_count > 10)
        .sort((a, b) => -(a.stargazers_count - b.stargazers_count))
        .map(repo => ({
            fullName: repo.full_name,
            htmlUrl: repo.html_url,
            stargazersCount: repo.stargazers_count,
        })) satisfies GitHubData;
};

const sampleData = [
    {
        fullName: 'hideo54/homepage (sample data)',
        htmlUrl: 'https://github.com/hideo54/homepage',
        stargazersCount: 25252,
    },
] satisfies GitHubData;

const main = async () => {
    const contributions = githubPat ? await getContributions() : sampleData;
    await writeGenerated('github', contributions);
};

main();
