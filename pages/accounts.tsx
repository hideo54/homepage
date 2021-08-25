import { InferGetStaticPropsType, NextPage } from 'next';
import styled from 'styled-components';
import fs from 'fs/promises';
import yaml from 'yaml';
import Layout from '../components/Layout';
import { GoBackIconLink } from '../components/atoms';

interface Tag {
    color: string;
    name: string;
    username: string;
    link?: string;
}

interface Data {
    accounts: {
        [key: string]: Tag[];
    };
}

const TagDiv = styled.div<{ color: string; hoverable?: boolean; }>`
    display: flex;
    align-items: center;
    margin-right: 1em;
    margin-bottom: 1em;
    padding: 1em;
    border: 2px solid ${props => props.color};
    border-radius: 20px;
    ${props => props.hoverable ? `
        &:hover {
            background-color: #EEEEEE;
            @media (prefers-color-scheme: dark) {
                background-color: #333333;
            }
            transform: scale(1.1);
        }
    ` : ''}
    div.circle {
        display: inline-block;
        background-color: ${props => props.color};
        width: 1em;
        height: 1em;
        margin-right: 1em;
        border-radius: 50%;
    }
    div.username {
        margin-top: 1em;
    }
`;

const TagComponent: React.FC<Tag> = ({ color, name, username, link }) => {
    const body = (
        <TagDiv color={color} hoverable={Boolean(link)}>
            <div className='circle' />
            <div>
                <div>{name}</div>
                <div className='username'>{username}</div>
            </div>
        </TagDiv>
    );
    if (link) {
        return (
            <a href={link} target='_blank' rel='noopener noreferrer' style={{ textDecoration: 'none' }}>{body}</a>
        );
    }
    return body;
};

export const getStaticProps = async () => {
    const yamlStr = await fs.readFile('data.yaml', 'utf-8');
    const data = yaml.parse(yamlStr) as Data;
    return {
        props: { data },
    };
};

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

const main: NextPage<StaticProps> = ({ data }) => (
    <Layout title='アカウント一覧 | hideo54.com' description='hideo54が所持している各サービスのアカウントの一覧です。'>
        <nav style={{ margin: '1em 0' }}>
            <GoBackIconLink href='/'>トップページ</GoBackIconLink>
        </nav>
        <h1>アカウント一覧</h1>
        {Object.keys(data.accounts).map(category => (
            <section key={category}>
                <h2>{category}</h2>
                {category === 'Games' && <p>私が知っている人からの友達申請しか受け付けません。</p>}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginBottom: '2em',
                }}>
                    {data.accounts[category].map(tag => (
                        <TagComponent
                            key={tag.name}
                            color={tag.color}
                            name={tag.name}
                            username={tag.username}
                            link={tag.link}
                        />
                    ))}
                </div>
            </section>
        ))}
    </Layout>
);

export default main;
