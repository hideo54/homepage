import { useEffect, type ComponentPropsWithoutRef } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
            <Head>
                <script dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtag.GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                        });
                    `,
                }} />
            </Head>
            <Component {...pageProps} />
        </MDXProvider>
    );
};

export default App;
