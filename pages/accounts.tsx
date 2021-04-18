import { InferGetStaticPropsType, NextPage } from 'next';
import fs from 'fs/promises';
import yaml from 'yaml';
import { Tag, TagProps } from '../src/components';

interface Data {
    accounts: {
        [key: string]: TagProps[];
    };
}

export const getStaticProps = async () => {
    const yamlStr = await fs.readFile('data.yaml', 'utf-8');
    const data = yaml.parse(yamlStr) as Data;
    return {
        props: { data },
    };
};

type StaticProps = InferGetStaticPropsType<typeof getStaticProps>;

const main: NextPage<StaticProps> = ({ data }) => (
    <>
        <h1>アカウント一覧</h1>
        {Object.keys(data.accounts).map(category => (
            <section key={category}>
                <h2>{category}</h2>
                {data.accounts[category].map(tag => (
                    <Tag
                        key={tag.name}
                        color={tag.color}
                        name={tag.name}
                        username={tag.username}
                        link={tag.link}
                    />
                ))}
            </section>
        ))}
    </>
);

export default main;
