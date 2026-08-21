import { MDXProvider } from '@mdx-js/react';
import { ChevronForward, Open } from '@styled-icons/ionicons-outline';
import clsx from 'clsx';
import type { AppProps } from 'next/app';
import { Noto_Sans_JP } from 'next/font/google';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { type ComponentPropsWithoutRef, useEffect } from 'react';
import './globals.css';
import { IconAnchor, IconNextLink } from '../components/iconTools';
import * as gtag from '../lib/gtag';

const mdxComponents = {
    a: (
        props: ComponentPropsWithoutRef<'a'> & {
            hasH2Parent?: boolean;
        },
    ) =>
        props.href?.startsWith('/') ? (
            <IconNextLink
                {...{ ...props, href: props.href }}
                RightIcon={props.hasH2Parent ? ChevronForward : undefined}
            />
        ) : (
            <IconAnchor RightIcon={Open} {...props} />
        ),
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote
            {...props}
            className={clsx('typography-blockquote', props.className)}
        />
    ),
    code: (props: ComponentPropsWithoutRef<'code'>) => (
        <code {...props} className={clsx('typography-code', props.className)} />
    ),
    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
        <h1 {...props} className={clsx('typography-h1', props.className)} />
    ),
    h2: (props: ComponentPropsWithoutRef<'h2'>) => {
        const className = clsx('typography-h2', props.className);
        return (
            // @ts-expect-error 許してくれ…
            props.children?.props && 'href' in props.children.props ? (
                // h2 の children に hasH2Parent を追加する
                <h2 {...props} className={className}>
                    {/* @ts-expect-error 許してくれ… */}
                    {React.cloneElement(props.children, { hasH2Parent: true })}
                </h2>
            ) : (
                <h2 {...props} className={className} />
            )
        );
    },
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
        <h3 {...props} className={clsx('typography-h3', props.className)} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
        <h4 {...props} className={clsx('typography-h4', props.className)} />
    ),
    h5: (props: ComponentPropsWithoutRef<'h5'>) => (
        <h5 {...props} className={clsx('typography-h5', props.className)} />
    ),
    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
        <hr {...props} className={clsx('typography-hr', props.className)} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
        <ol {...props} className={clsx('typography-list', props.className)} />
    ),
    p: (props: ComponentPropsWithoutRef<'p'>) => (
        <p {...props} className={clsx('typography-p', props.className)} />
    ),
    pre: (props: ComponentPropsWithoutRef<'pre'>) => (
        <pre {...props} className={clsx('typography-pre', props.className)} />
    ),
    table: (props: ComponentPropsWithoutRef<'table'>) => (
        <table
            {...props}
            className={clsx('typography-table', props.className)}
        />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
        <ul {...props} className={clsx('typography-list', props.className)} />
    ),
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
            <Script
                // biome-ignore lint/security/noDangerouslySetInnerHtml: This is the official way to add gtag
                dangerouslySetInnerHTML={{
                    __html: `
                        if (window.location.hostname === 'hideo54.web.app' || window.location.hostname === 'hideo54.firebaseapp.com') {
                            window.location.href = 'https://hideo54.com';
                        }
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtag.GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
            <div className={`${noto.variable} font-sans`}>
                <Component {...pageProps} />
            </div>
        </MDXProvider>
    );
};

export default App;
