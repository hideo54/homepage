import { Tag, TagProps } from '../src/components';
import data from '../data.yaml';

const accounts = data.accounts as {[key: string]: TagProps[]};

const tagGroups = Object.keys(accounts).map(category => (
    <section key={category}>
        <h2>{category}</h2>
        {accounts[category].map(tag => (
            <Tag
                key={tag.name}
                color={tag.color}
                name={tag.name}
                username={tag.username}
                link={tag.link}
            />
        ))}
    </section>
));

const main = () => <>
    <h1>アカウント一覧</h1>
    {tagGroups}
</>;

export default main;
