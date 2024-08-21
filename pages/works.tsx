import type { InferGetStaticPropsType, NextPage } from 'next';
import { Github, Slack, Twitter } from '@styled-icons/fa-brands';
import { Robot } from '@styled-icons/fa-solid';
import { Construct, Globe, HardwareChip, Open } from '@styled-icons/ionicons-outline';
import axios from 'axios';
import { IconAnchor, IconSpan } from '../components/iconTools';
import Layout from '../components/Layout';

interface Work {
    category: 'Web' | 'Machine Learning' | 'Slack bot' | 'Twitter bot' | 'Utility' | 'IoT';
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
        title: 'hideo54.com',
        description: 'このページ。hideo54について。',
        url: 'https://hideo54.com',
        imageUrl: 'https://img.hideo54.com/icons/main.png',
        repoUrl: 'https://github.com/hideo54/homepage',
    },
    {
        category: 'Web',
        title: 'いうていけろ - hideo54のブログ',
        description: 'とりとめのない誰得エッセイから、Google検索結果第1位の技術 tips まで。何でも載っける自由気ままなブログ。',
        url: 'https://blog.hideo54.com',
        imageUrl: 'https://img.hideo54.com/icons/main.png',
        repoUrl: 'https://github.com/hideo54/blog',
    },
    {
        category: 'Web',
        title: 'hideo54 Lab',
        description: 'サービスにするほどでもない小さな制作物や研究結果を公開。',
        url: 'https://lab.hideo54.com',
        repoUrl: 'https://github.com/hideo54/lab',
    },
    {
        category: 'IoT',
        title: 'hideout',
        description: '自作スマートホームシステム。時報、室内の気温や室温・二酸化炭素の情報、緊急速報などを音声で通知。部屋の照明を時刻に合わせて自動で調整。',
        url: 'https://github.com/hideo54/hideout',
        repoUrl: 'https://github.com/hideo54/hideout',
    },
    {
        category: 'Utility',
        title: 'userscripts',
        description: 'hideo54が自分用に制作したカスタムCSS・JS群。',
        url: 'https://github.com/hideo54/userscripts',
        repoUrl: 'https://github.com/hideo54/userscripts',
    },
    {
        category: 'Slack bot',
        title: 'psi-slack',
        description: '2021年度進学・システム創成学科 PSI コース Slack のための Slack bot。「学科からのお知らせ」の更新通知など。',
        url: 'https://github.com/hideo54/psi-slack',
        imageUrl: 'https://pbs.twimg.com/profile_images/2224958669/PSIlogo_400x400.PNG',
        repoUrl: 'https://github.com/hideo54/psi-slack',
    },
    {
        category: 'Web',
        title: '選挙ウォッチ',
        description: '衆院選・参院選に向けた各党の候補者擁立状況をまとめたウェブサイト。複雑な候補者調整・競合状況の最新の情報を地図でわかりやすく確認できるほか、議席数予想も可能。実は情報収集の多くが自動化されている点も特徴。',
        url: 'https://senkyo.watch',
        imageUrl: 'https://senkyo.watch/assets/images/icon.svg',
    },
    {
        category: 'Slack bot',
        title: 'ut-slack',
        description: '2019年度入学・理科1類34組 Slack のための Slack bot。「教務課からのお知らせ」ページや、一部の教員のウェブサイトの更新通知など。',
        url: 'https://github.com/hideo54/ut-slack',
        imageUrl: 'https://raw.githubusercontent.com/hideo54/emoji/master/images/uts1-34.png',
        repoUrl: 'https://github.com/hideo54/ut-slack',
        until: '2020年夏',
    },
    {
        category: 'Twitter bot',
        title: '@UT_COVID19',
        description: '2020年前半に突如発生したコロナ危機をうけ東京大学教養学部が臨時に設けた情報サイトの更新を監視し、その差分をツイートするbot。',
        url: 'https://twitter.com/UT_COVID19',
        imageUrl: 'https://pbs.twimg.com/profile_images/1282485077570514945/DyibRRov_200x200.png',
        repoUrl: 'https://github.com/hideo54/UT_COVID-19',
        until: '2020年夏',
    },
];

const articles: Work[] = [
    {
        category: 'Machine Learning',
        title: '機械学習でμ\'sの声を識別する',
        description: 'アイドルグループ「μ\'s」のメンバーの声質を学習し、ソロ曲の音声を与えると誰の声かを当てるプログラムについての記事です。',
        url: 'https://booth.pm/ja/items/396886',
        repoUrl: 'https://github.com/hideo54/ML-LoveLive-Voice',
        until: '2016年冬',
    },
];

const WorkDetail: React.FC<{
    work: Work;
    untilTransformer: (s: string) => string;
}> = ({ work, untilTransformer }) => (
    <div key={work.title} className='not-prose my-4 p-4 border-solid border-black shadow rounded-2xl dark:border dark:border-neutral-600'>
        <div className='flex justify-between'>
            <div>
                <div>
                    <IconSpan margin='0.2em' color='#888888' LeftIcon={getCategoryIcon(work.category)}>
                        {work.category}
                    </IconSpan>
                </div>
                <p className='text-xl font-semibold'>
                    <IconAnchor href={work.url} RightIcon={Open}>
                        {work.title}
                    </IconAnchor>
                </p>
            </div>
            {work.imageUrl &&
                <img
                    src={work.imageUrl}
                    alt='Service Icon'
                    className='w-12 h-12 ml-4'
                />
            }
        </div>
        <p className='my-4'>
            {work.description}
        </p>
        {work.until && (
            <p>
                {untilTransformer(work.until)}
            </p>
        )}
        {work.repoUrl && (
            <p>
                <IconAnchor LeftIcon={Github} href={work.repoUrl} margin='0.1em'>
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
            props: { contributions: [
                {
                    full_name: 'hideo54/homepage (sample in developemnt environment!)',
                    stargazers_count: 25252,
                    html_url: 'https://github.com/hideo54/homepage',
                },
            ] },
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
            q: 'is:pr is:merged author:hideo54',
            per_page: 100,
        },
    });
    const { items } = res.data;
    const repoNames = new Set(items.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [, name] = item.html_url.match(/^https:\/\/github.com\/(.+)\/pull\/\d+$/)!;
        return name;
    }));
    const itemDetailRequests = Array.from(repoNames).map(name => axios.get<{
        full_name: string;
        stargazers_count: number;
        html_url: string;
    }>(`https://api.github.com/repos/${name}`, {
        headers: {
            accept: 'application/vnd.github.v3+json',
        },
    }));
    const targetRepos = (await Promise.all(itemDetailRequests)).map(res => res.data).filter(repo =>
        repo.stargazers_count > 10
    ).sort((repoA, repoB) =>
        repoA.stargazers_count < repoB.stargazers_count ? 1 : -1
    );
    return {
        props: { contributions: targetRepos },
    };
};

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

const App: NextPage<StaticProps> = ({ contributions }) => {
    return (
        <Layout title='つくったもの | hideo54.com' description='hideo54が個人で制作したものの一部を紹介します。'>
            <section>
                <h1>つくったもの</h1>
                <p>…のうち、hideo54が個人で制作したもので、公開されているもので、お気に入りのもの。</p>
                {works.map(work =>
                    <WorkDetail key={work.title} work={work} untilTransformer={s => `(${s}に運営終了)`} />
                )}
            </section>
            <section>
                <h2>書いたもの</h2>
                <p>…のうち、お気に入りのもの。</p>
                {articles.map(article =>
                    <WorkDetail key={article.title} work={article} untilTransformer={s => `(${s}に執筆・公開)`} />
                )}
            </section>
            <section>
                <h2>Contributions</h2>
                <p>hideo54 が出した pull request が merge されたことのある著名 OSS</p>
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
                    src='https://github.com/sponsors/hideo54/button'
                    title='Sponsor hideo54'
                    width='116'
                    height='35'
                    style={{
                        border: 0,
                    }}
                />
            </section>
        </Layout>
    );
};

export default App;
