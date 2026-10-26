import type { ReactNode } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { IconLink } from './iconTools';

const iconUrl = 'https://img.hideo54.com/icons/main.png';

const SiteLayout = ({
    siteName,
    children,
    title = siteName,
    description,
    imageUrl = iconUrl,
    twitterCardType = 'summary',
    showNavbar = true,
}: {
    siteName: string;
    children?: ReactNode;
    title?: string;
    description: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    showNavbar?: boolean;
}) => (
    <>
        <meta content={description} name='description' />
        <meta content={siteName} property='og:site_name' />
        <meta content={title} property='og:title' />
        <meta content={description} property='og:description' />
        {imageUrl && <meta content={imageUrl} property='og:image' />}
        <meta content={twitterCardType} name='twitter:card' />
        <meta content='@hideo54' name='twitter:site' />
        <title>{title}</title>
        <link href={iconUrl} rel='icon' type='image/png' />
        <link href={iconUrl} rel='apple-touch-icon' />
        {showNavbar && (
            <div className='relative mx-4 mt-2 -mb-2 max-w-(--breakpoint-lg) transition hover:underline'>
                <IconLink LeftIcon={IoChevronBack} to='/'>
                    {siteName}
                </IconLink>
            </div>
        )}
        <main>{children}</main>
    </>
);

export default SiteLayout;
