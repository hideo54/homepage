import type { InferGetStaticPropsType, NextPage } from 'next';
import fs from 'fs/promises';
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
    const defaultClassName = 'flex items-center mb-4 mr-4 p-4 border-2 rounded-2xl';
    const hoverableClassName = 'hover:scale-110';
    const className = defaultClassName + (link ? (' ' + hoverableClassName) : '');
    const body = (
        <div className={className} style={{ borderColor: color }}>
            <div
                className='inline-block w-4 h-4 mr-4 rounded-full'
                style={{ backgroundColor: color }}
            />
            <div>
                <div>{name}</div>
                <div>{username}</div>
            </div>
        </div>
    );
    if (link) {
        return (
            <a href={link} target='_blank' rel='noopener noreferrer'>{body}</a>
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

const App: NextPage<StaticProps> = ({ data }) => (
    <Layout title='アカウント一覧 | hideo54.com' description='hideo54が所持している各サービスのアカウントの一覧です。'>
        <h1>アカウント一覧</h1>
        {Object.keys(data.accounts).map(category => (
            <section key={category}>
                <h2>{category}</h2>
                {category === 'Games' && <p>私が知っている人からの友達申請しか受け付けません。</p>}
                <div className='flex flex-wrap mb-4'>
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

export default App;
