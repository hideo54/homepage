import { ChevronBack } from '@styled-icons/ionicons-outline';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { IconNextLink } from './iconTools';

const Layout = ({
    children,
    title = 'hideo54.com',
    description = 'hideo54のホームページ',
    imageUrl = 'https://img.hideo54.com/icons/main.png',
    twitterCardType = 'summary',
    showGoTop = true,
}: {
    children?: ReactNode;
    title?: string;
    description?: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    Header?: JSX.Element;
    showGoTop?: boolean;
}) => (
    <>
        <Head>
            <meta charSet='utf-8' />
            <meta
                content='initial-scale=1.0, width=device-width'
                name='viewport'
            />
            <meta content={description} name='description' />
            <meta
                content='hideo54.com'
                key='og:site_name'
                property='og:site_name'
            />
            <meta content={title} key='og:title' property='og:title' />
            <meta
                content={description}
                key='og:description'
                property='og:description'
            />
            {imageUrl && <meta content={imageUrl} property='og:image' />}
            <meta
                content={twitterCardType}
                key='twitter:card'
                name='twitter:card'
            />
            <meta content='@hideo54' key='twitter:site' name='twitter:site' />
            <title>{title}</title>
            <link
                href='https://img.hideo54.com/icons/main.png'
                rel='icon'
                type='image/png'
            />
            <link
                href='https://img.hideo54.com/icons/main.png'
                rel='apple-touch-icon'
            />
        </Head>
        <main>
            {showGoTop && (
                <nav>
                    <IconNextLink href='/' LeftIcon={ChevronBack}>
                        トップページ
                    </IconNextLink>
                </nav>
            )}
            {children}
        </main>
    </>
);

export default Layout;
