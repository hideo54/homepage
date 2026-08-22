import fs from 'node:fs/promises';
import clsx from 'clsx';
import type { InferGetStaticPropsType, NextPage } from 'next';
import yaml from 'yaml';
import Layout from '../components/Layout';

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
        <div
            className={clsx(
                'card card-border card-sm mr-4 mb-4 border-2',
                link && 'hover:scale-110',
            )}
            style={{ borderColor: color }}
        >
            <div className='card-body flex-row items-center text-base'>
                <div
                    className='size-4 shrink-0 rounded-full'
                    style={{ backgroundColor: color }}
                />
                <div>
                    <div>{name}</div>
                    <div>{username}</div>
                </div>
            </div>
        </div>
    );
    if (link) {
        return (
            <a href={link} rel='noopener noreferrer' target='_blank'>
                {body}
            </a>
        );
    }
    return body;
};

export const getStaticProps = async () => {
    const yamlStr = await fs.readFile('data/accounts.yaml', 'utf-8');
    const data = yaml.parse(yamlStr) as Data;
    return {
        props: { data },
    };
};

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

const App: NextPage<StaticProps> = ({ data }) => (
    <Layout
        description='hideo54が所持している各サービスのアカウントの一覧です。'
        title='アカウント一覧 | hideo54.com'
    >
        <h1 className='typography-h1'>アカウント一覧</h1>
        {Object.keys(data.accounts).map(category => (
            <section key={category}>
                <h2 className='typography-h2'>{category}</h2>
                {category === 'Games' && (
                    <p className='typography-p'>
                        私が知っている人からの友達申請しか受け付けません。
                    </p>
                )}
                <div className='mb-4 flex flex-wrap'>
                    {data.accounts[category].map(tag => (
                        <TagComponent
                            color={tag.color}
                            key={tag.name}
                            link={tag.link}
                            name={tag.name}
                            username={tag.username}
                        />
                    ))}
                </div>
            </section>
        ))}
    </Layout>
);

export default App;
