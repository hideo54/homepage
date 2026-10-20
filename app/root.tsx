import { MDXProvider } from '@mdx-js/react';
import { type ReactNode, useEffect, useRef } from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from 'react-router';
import type { Route } from './+types/root';
import './global.css';
import PageLayout from './components/Layout';
import * as gtag from './lib/gtag';
import { mdxComponents } from './mdxComponents';

export const Layout = ({ children }: { children: ReactNode }) => (
    <html lang='ja'>
        <head>
            <meta charSet='utf-8' />
            <meta
                content='initial-scale=1.0, width=device-width'
                name='viewport'
            />
            <Meta />
            <Links />
            <script
                // biome-ignore lint/security/noDangerouslySetInnerHtml: This is the official way to add gtag
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gtag.GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </head>
        <body>
            <MDXProvider components={mdxComponents}>
                <div className='h-full font-display'>{children}</div>
            </MDXProvider>
            <ScrollRestoration />
            <Scripts />
        </body>
    </html>
);

const App = () => {
    const location = useLocation();
    const isInitialRender = useRef(true);
    useEffect(() => {
        // 初回は head の gtag('config') で送信済み
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        gtag.pageview(location.pathname);
    }, [location.pathname]);
    return <Outlet />;
};

export default App;

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) =>
    isRouteErrorResponse(error) && error.status === 404 ? (
        <PageLayout title='404 | hideo54.com'>
            <h1 className='typography-h1'>404</h1>
            <p className='typography-p'>ページが見つかりません。</p>
        </PageLayout>
    ) : (
        <PageLayout title='Error | hideo54.com'>
            <h1 className='typography-h1'>Error</h1>
            <p className='typography-p'>
                {error instanceof Error ? error.message : 'Unknown error'}
            </p>
        </PageLayout>
    );
