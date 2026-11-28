import { siteName } from '../site';

const Index = () => (
    <main>
        <h1 className='typography-h1'>{siteName}</h1>
        <p className='typography-p text-lg'>
            記事の一覧はしばらく作りません。
            <br />
            これまでの記事には、リンクを知っていればアクセスできます。
        </p>
    </main>
);

export default Index;
