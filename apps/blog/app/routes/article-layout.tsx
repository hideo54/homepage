import SiteLayout from '@hideo54/ui/components/SiteLayout';
import { Outlet, useMatches } from 'react-router';
import LocalTime from '../components/LocalTime';
import { siteName } from '../site';

type Frontmatter = {
    title: string;
    date: string;
    update?: string;
    category: string;
    tags: string[];
    ogp?: string;
};

const ArticleLayout = () => {
    const frontmatter = useMatches().at(-1)?.handle as Frontmatter;
    return (
        <SiteLayout
            description={frontmatter.title}
            imageUrl={frontmatter.ogp}
            showNavbar={false}
            siteName={siteName}
            title={`${frontmatter.title} | ${siteName}`}
            twitterCardType={
                frontmatter.ogp ? 'summary_large_image' : 'summary'
            }
        >
            <article>
                <header className='my-8'>
                    <div className='text-lg'>{siteName}</div>
                    <h1 className='typography-h1'>{frontmatter.title}</h1>
                    <div>
                        <LocalTime date={frontmatter.date} />
                        {frontmatter.update && (
                            <>
                                {' (更新: '}
                                <LocalTime date={frontmatter.update} />)
                            </>
                        )}
                    </div>
                    <hr className='border-base-200 my-6' />
                </header>
                <Outlet />
            </article>
        </SiteLayout>
    );
};

export default ArticleLayout;
