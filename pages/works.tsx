import type { InferGetStaticPropsType, NextPage } from 'next';
import styled from 'styled-components';
import { Github, Slack, Twitter } from '@styled-icons/fa-brands';
import { Robot } from '@styled-icons/fa-solid';
import { Construct, Globe, HardwareChip } from '@styled-icons/ionicons-outline';
import dayjs from 'dayjs';
import Layout from '../components/Layout';
import { GoBackIconLink, IconLink, OpenIconLink, IconText } from '../components/atoms';

import axios from 'axios';

const GrassCoverDiv = styled.div<{ height: number; }>`
    position: relative;
    width: 100%;
    height: ${props => props.height}px;
    margin: 1em 0;
    overflow: hidden;
    img, p {
        transition: transform 0.2s linear;
    }
    &:hover {
        img, p {
            transform: scale(1.1);
        }
    }
`;

const GrassImg = styled.img<{ height: number; }>`
    width: 100%;
    height: ${props => props.height}px;
    object-fit: cover;
    object-position: right;
`;

const GitHubProfileP = styled.p`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    font-size: 2em;
    text-align: center;
    background-color: #333333AA;
`;

const GitHubProfileBanner: React.FC<{ height: number; }> = ({ height }) => {
    const url = 'https://github.com/hideo54';
    const date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    return (
        <a href={url} target='_blank' rel='noopener noreferrer'>
            <GrassCoverDiv height={height}>
                <GrassImg src={`https://img.hideo54.com/github-grass/${date}.svg`} height={height} />
                <GitHubProfileP>
                    <IconText Icon={Github} color='#CCCCCC' margin='0.2em'>hideo54</IconText>
                </GitHubProfileP>
            </GrassCoverDiv>
        </a>
    );
};

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
        title: 'Candidates2021 - 衆院選情報サイト',
        description: '2021年の衆議院選挙に向けた各党の候補者擁立状況をまとめたウェブサイト。複雑な候補者調整・競合状況の最新の情報を地図でわかりやすく確認できるほか、議席数予想もできます。実は情報収集の多くが自動化されている点も特徴。',
        url: 'https://candidates2021.info',
        imageUrl: 'https://candidates2021.info/logo.svg',
    },
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
        title: '機械学習でμ’sの声を識別する',
        description: "アイドルグループ「μ's」のメンバーの声質を学習し、ソロ曲の音声を与えると誰の声かを当てるプログラムを作成し、それについてまとめた記事です。",
        url: 'https://sunpro.io/c91/hideo54.html',
        imageUrl: 'https://sunpro.io/c91/favicon.png',
        repoUrl: 'https://github.com/hideo54/ML-LoveLive-Voice',
        until: '2016年冬',
    },
];

const WorkDiv = styled.div`
    margin: 2em 0;
    padding: 1em;
    border: 1px solid #CCCCCC;
    border-radius: 24px;
    box-shadow: 0px 5px 10px 0px #CCCCCC;
`;

const LogoImg = styled.img`
    width: 48px;
    height: 48px;
    margin-left: 1em;
`;

const DescriptionP = styled.p<{ marginTop?: string; fontSize?: string; color?: string; }>`
    margin-top: ${props => props.marginTop || '1em'};
    margin-bottom: 0;
    ${props => props.fontSize && `
        font-size: ${props.fontSize};
    `}
    ${props => props.color && `
        color: ${props.color};
    `}
`;

const WorkDetail: React.FC<{ work: Work, untilTransformer: (s: string) => string }> = ({ work, untilTransformer }) => (
    <WorkDiv key={work.title}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
            <div>
                <div>
                    <IconText margin='0.2em' color='#888888' Icon={getCategoryIcon(work.category)}>{work.category}</IconText>
                </div>
                <DescriptionP fontSize='1.2em' marginTop='0.5em'>
                    <OpenIconLink href={work.url}>{work.title}</OpenIconLink>
                </DescriptionP>
            </div>
            {work.imageUrl && <LogoImg src={work.imageUrl} />}
        </div>
        <DescriptionP>{work.description}</DescriptionP>
        {work.until && (
            <DescriptionP>
                {untilTransformer(work.until)}
            </DescriptionP>
        )}
        {work.repoUrl && (
            <DescriptionP>
                <IconLink LeftIcon={Github} href={work.repoUrl} margin='0.1em'>オープンソースです。</IconLink>
            </DescriptionP>
        )}
    </WorkDiv>
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

const Section = styled.section`
    margin-bottom: 4em;
`;

export const getStaticProps = async () => {
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
        const [ , name ] = item.html_url.match(/^https:\/\/github.com\/(.+)\/pull\/\d+$/)!;
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

const main: NextPage<StaticProps> = ({ contributions }) => {
    return (
        <Layout title='つくったもの' description='hideo54が個人で制作したものの一部を紹介します。'>
            <nav style={{ margin: '1em 0' }}>
                <GoBackIconLink href='/'>トップページ</GoBackIconLink>
            </nav>
            <GitHubProfileBanner height={200} />
            <Section>
                <h1>つくったもの</h1>
                <p>…のうち、hideo54が個人で制作したもので、公開されているもので、お気に入りのもの。</p>
                {works.map(work =>
                    <WorkDetail key={work.title} work={work} untilTransformer={s => `(${s}に運営終了)`} />
                )}
            </Section>
            <Section>
                <h2>書いたもの</h2>
                <p>…のうち、お気に入りのもの。</p>
                {articles.map(article =>
                    <WorkDetail key={article.title} work={article} untilTransformer={s => `(${s}に執筆・公開)`} />
                )}
            </Section>
            <Section>
                <h2>Contributions</h2>
                <p>hideo54 が出した pull request が merge されたことのある著名 OSS</p>
                <ul>
                    {contributions.map(repo => (
                        <li key={repo.full_name}>
                            <OpenIconLink href={repo.html_url}>{repo.full_name}</OpenIconLink>
                        </li>
                    ))}
                </ul>
            </Section>
        </Layout>
    );
};

export default main;
