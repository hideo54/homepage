import type { JSX, ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = ({
    children,
    title = 'hideo54.com',
    description = 'hideo54のホームページ',
    imageUrl = 'https://img.hideo54.com/icons/main.png',
    twitterCardType = 'summary',
    showNavbar = true,
}: {
    children?: ReactNode;
    title?: string;
    description?: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    Header?: JSX.Element;
    showNavbar?: boolean;
}) => (
    <>
        <meta content={description} name='description' />
        <meta content='hideo54.com' property='og:site_name' />
        <meta content={title} property='og:title' />
        <meta content={description} property='og:description' />
        {imageUrl && <meta content={imageUrl} property='og:image' />}
        <meta content={twitterCardType} name='twitter:card' />
        <meta content='@hideo54' name='twitter:site' />
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
        {showNavbar && <Navbar />}
        <main>{children}</main>
    </>
);

export default Layout;
