import { InferGetStaticPropsType, NextPage } from 'next';
import Layout from '../components/Layout';
import fs from 'fs/promises';
import yaml from 'yaml';
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

const TagComponent: React.FC<Tag> = ({ color, name, username, link }) => {
    const body = (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1em',
            padding: '1em',
            border: `2px solid ${color}`,
            borderRadius: '20px',
        }}>
            <div style={{
                display: 'inline-block',
                backgroundColor: color,
                width: '1em',
                height: '1em',
                marginRight: '1em',
                borderRadius: '50%',
            }} />
            <div>
                <div>{name}</div>
                <div style={{ marginTop: '1em' }}>{username}</div>
            </div>
        </div>
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
    <Layout>
        <nav style={{ margin: '1em 0' }}>
            <GoBackIconLink href='/'>トップページ</GoBackIconLink>
        </nav>
        <h1>アカウント一覧</h1>
        {Object.keys(data.accounts).map(category => (
            <section key={category}>
                <h2>{category}</h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
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
