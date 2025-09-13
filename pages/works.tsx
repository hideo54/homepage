import { Github, Slack, Twitter } from '@styled-icons/fa-brands';
import { Robot } from '@styled-icons/fa-solid';
import {
    Construct,
    Globe,
    HardwareChip,
    Open,
} from '@styled-icons/ionicons-outline';
import axios from 'axios';
import type { InferGetStaticPropsType, NextPage } from 'next';
import { IconAnchor, IconSpan } from '../components/iconTools';
import Layout from '../components/Layout';

interface Work {
    category:
        | 'Web'
        | 'Machine Learning'
        | 'Slack bot'
        | 'Twitter bot'
        | 'Utility'
        | 'IoT';
    title: string;
    description: string;
    until?: string;
    url: string;
    imageUrl?: string;
    repoUrl?: string;
}

const works: Work[] = [
    {
        category: 'Web',
        description: 'このページ。hideo54について。',
        imageUrl: 'https://img.hideo54.com/icons/main.png',
        repoUrl: 'https://github.com/hideo54/homepage',
        title: 'hideo54.com',
        url: 'https://hideo54.com',
    },
    {
        category: 'Web',
        description:
            'とりとめのない誰得エッセイから、Google検索結果第1位の技術 tips まで。何でも載っける自由気ままなブログ。',
        imageUrl: 'https://img.hideo54.com/icons/main.png',
        repoUrl: 'https://github.com/hideo54/blog',
        title: 'いうていけろ - hideo54のブログ',
        url: 'https://blog.hideo54.com',
    },
    {
        category: 'Web',
        description: 'サービスにするほどでもない小さな制作物や研究結果を公開。',
        repoUrl: 'https://github.com/hideo54/lab',
        title: 'hideo54 Lab',
        url: 'https://lab.hideo54.com',
    },
    {
        category: 'Web',
        description:
            '衆院選・参院選に向けた各党の候補者擁立状況をまとめたウェブサイト。複雑な候補者調整・競合状況の最新の情報を地図でわかりやすく確認でき、議席数予想も可能な、日本最大の選挙オタク向けウェブサービス。',
        imageUrl: 'https://senkyo.watch/assets/images/icon.svg',
        title: '選挙ウォッチ',
        url: 'https://senkyo.watch',
    },
    {
        category: 'Utility',
        description: 'hideo54が自分用に制作したカスタムCSS・JS群。',
        repoUrl: 'https://github.com/hideo54/userscripts',
        title: 'userscripts',
        url: 'https://github.com/hideo54/userscripts',
    },
    {
        category: 'IoT',
        description:
            '自作スマートホームシステム。時報、室内の気温や室温・二酸化炭素の情報、緊急速報などを音声で通知。部屋の照明を時刻に合わせて自動で調整。',
        repoUrl: 'https://github.com/hideo54/hideout',
        title: 'hideout',
        until: '2020年',
        url: 'https://github.com/hideo54/hideout',
    },
    {
        category: 'Slack bot',
        description:
            '2021年度進学・システム創成学科 PSI コース Slack のための Slack bot。「学科からのお知らせ」の更新通知など。',
        imageUrl:
            'https://pbs.twimg.com/profile_images/2224958669/PSIlogo_400x400.PNG',
        repoUrl: 'https://github.com/hideo54/psi-slack',
        title: 'psi-slack',
        url: 'https://github.com/hideo54/psi-slack',
    },
    {
        category: 'Slack bot',
        description:
            '2019年度入学・理科1類34組 Slack のための Slack bot。「教務課からのお知らせ」ページや、一部の教員のウェブサイトの更新通知など。',
        imageUrl:
            'https://raw.githubusercontent.com/hideo54/emoji/master/images/uts1-34.png',
        repoUrl: 'https://github.com/hideo54/ut-slack',
        title: 'ut-slack',
        until: '2020年夏',
        url: 'https://github.com/hideo54/ut-slack',
    },
    {
        category: 'Twitter bot',
        description:
            '2020年前半に突如発生したコロナ危機をうけ東京大学教養学部が臨時に設けた情報サイトの更新を監視し、その差分をツイートするbot。',
        imageUrl:
            'https://pbs.twimg.com/profile_images/1282485077570514945/DyibRRov_200x200.png',
        repoUrl: 'https://github.com/hideo54/UT_COVID-19',
        title: '@UT_COVID19',
        until: '2020年夏',
        url: 'https://twitter.com/UT_COVID19',
    },
];

const articles: Work[] = [
    {
        category: 'Machine Learning',
        description:
            "アイドルグループ「μ's」のメンバーの声質を学習し、ソロ曲の音声を与えると誰の声かを当てるプログラムについての記事です。",
        repoUrl: 'https://github.com/hideo54/ML-LoveLive-Voice',
        title: "機械学習でμ'sの声を識別する",
        until: '2016年冬',
        url: 'https://booth.pm/ja/items/396886',
    },
];

const WorkDetail: React.FC<{
    work: Work;
    untilTransformer: (s: string) => string;
}> = ({ work, untilTransformer }) => (
    <div
        className='not-prose my-4 rounded-2xl border-black border-solid p-4 shadow dark:border dark:border-neutral-600'
        key={work.title}
    >
        <div className='flex justify-between'>
            <div>
                <div>
                    <IconSpan
                        color='#888888'
                        LeftIcon={getCategoryIcon(work.category)}
                        margin='0.2em'
                    >
                        {work.category}
                    </IconSpan>
                </div>
                <span className='mr-4 font-semibold text-xl'>
                    <IconAnchor href={work.url} RightIcon={Open}>
                        {work.title}
                    </IconAnchor>
                </span>
                {work.until && (
                    <span className='rounded-lg border-2 border-red-500 px-2 align-[2px] text-red-500 text-sm'>
                        {untilTransformer(work.until)}
                    </span>
                )}
            </div>
            {work.imageUrl && (
                <img
                    alt='Service Icon'
                    className='ml-4 h-12 w-12'
                    src={work.imageUrl}
                />
            )}
        </div>
        <p className='my-4'>{work.description}</p>
        {work.repoUrl && (
            <p>
                <IconAnchor
                    href={work.repoUrl}
                    LeftIcon={Github}
                    margin='0.1em'
                >
                    オープンソースです。
                </IconAnchor>
            </p>
        )}
    </div>
);

const getCategoryIcon = (category: Work['category']) => {
    if (category === 'Web') return Globe;
    if (category === 'Machine Learning') return Robot;
    if (category === 'Slack bot') return Slack;
    if (category === 'Twitter bot') return Twitter;
    if (category === 'Utility') return Construct;
    if (category === 'IoT') return HardwareChip;
    return Globe;
};

export const getStaticProps = async () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            props: {
                contributions: [
                    {
                        full_name:
                            'hideo54/homepage (sample in developemnt environment!)',
                        html_url: 'https://github.com/hideo54/homepage',
                        stargazers_count: 25252,
                    },
                ],
            },
        };
    }
    const res = await axios.get<{
        total_count: number;
        incomplete_results: boolean;
        items: {
            html_url: string;
            title: string;
        }[];
    }>('https://api.github.com/search/issues', {
        headers: {
            accept: 'application/vnd.github.v3+json',
        },
        params: {
            per_page: 100,
            q: 'is:pr is:merged author:hideo54',
        },
    });
    const { items } = res.data;
    const repoNames = new Set(
        items.map(item => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [, name] = item.html_url.match(
                /^https:\/\/github.com\/(.+)\/pull\/\d+$/,
            )!;
            return name;
        }),
    );
    const itemDetailRequests = Array.from(repoNames).map(name =>
        axios.get<{
            full_name: string;
            stargazers_count: number;
            html_url: string;
        }>(`https://api.github.com/repos/${name}`, {
            headers: {
                accept: 'application/vnd.github.v3+json',
            },
        }),
    );
    const targetRepos = (await Promise.all(itemDetailRequests))
        .map(res => res.data)
        .filter(repo => repo.stargazers_count > 10)
        .sort((repoA, repoB) =>
            repoA.stargazers_count < repoB.stargazers_count ? 1 : -1,
        );
    return {
        props: { contributions: targetRepos },
    };
};

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

const App: NextPage<StaticProps> = ({ contributions }) => {
    return (
        <Layout
            description='hideo54が個人で制作したものの一部を紹介します。'
            title='つくったもの | hideo54.com'
        >
            <section>
                <h1>つくったもの</h1>
                <p>
                    …のうち、hideo54が個人で制作したもので、公開されているもので、お気に入りのもの。
                </p>
                {works.map(work => (
                    <WorkDetail
                        key={work.title}
                        untilTransformer={s => `${s}に運営終了`}
                        work={work}
                    />
                ))}
            </section>
            <section>
                <h2>書いたもの</h2>
                <p>…のうち、お気に入りのもの。</p>
                {articles.map(article => (
                    <WorkDetail
                        key={article.title}
                        untilTransformer={s => `${s}に執筆・公開`}
                        work={article}
                    />
                ))}
            </section>
            <section>
                <h2>Contributions</h2>
                <p>
                    hideo54 が出した pull request が merge されたことのある著名
                    OSS
                </p>
                <ul>
                    {contributions.map(repo => (
                        <li key={repo.full_name}>
                            <IconAnchor href={repo.html_url} RightIcon={Open}>
                                {repo.full_name}
                            </IconAnchor>
                        </li>
                    ))}
                </ul>
            </section>
            <section className='mb-8'>
                <h2>Sponsor me!</h2>
                <iframe
                    height='35'
                    src='https://github.com/sponsors/hideo54/button'
                    style={{
                        border: 0,
                    }}
                    title='Sponsor hideo54'
                    width='116'
                />
            </section>
        </Layout>
    );
};

export default App;
