import { useEffect, type ComponentPropsWithoutRef } from 'react';
import type { AppProps } from 'next/app';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import { MDXProvider } from '@mdx-js/react';
import { Open } from '@styled-icons/ionicons-outline';
import './globals.css';
import * as gtag from '../lib/gtag';

const mdxComponents = {
    a: (props: ComponentPropsWithoutRef<'a'>) =>
        (props.href && props.href.startsWith('/'))
            ? <IconNextLink {...{ ...props, href: props.href } }/>
            : <IconAnchor RightIcon={Open} {...props} />,
};

const noto = Noto_Sans_JP({
    subsets: ['latin'],
    variable: '--font-noto',
    weight: ['400', '600', '700', '900'],
});

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
    return (
        <MDXProvider components={mdxComponents}>
            <Script id='ga' dangerouslySetInnerHTML={{
                __html: `
                    if (window.location.hostname === "hideo54.web.app" || window.location.hostname === 'hideo54.firebaseapp.com') {
                        window.location.href = 'https://hideo54.com';
                    }
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gtag.GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                `,
            }} />
            <div className={`${noto.variable} font-sans`}>
                <Component
                    {...pageProps}
                />
            </div>
        </MDXProvider>
    );
};

export default App;
