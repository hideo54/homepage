import { type ReactNode, useEffect, useRef } from 'react';
import {
    Links,
    Meta,
    Scripts,
    ScrollRestoration,
    useLocation,
} from 'react-router';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

export const Document = ({
    gaTrackingId,
    children,
}: {
    gaTrackingId: string;
    children: ReactNode;
}) => (
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
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaTrackingId}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </head>
        <body>
            <div className='h-full font-display'>{children}</div>
            <ScrollRestoration />
            <Scripts />
        </body>
    </html>
);

export const useGtagPageview = (gaTrackingId: string) => {
    const location = useLocation();
    const isInitialRender = useRef(true);
    useEffect(() => {
        // 初回は head の gtag('config') で送信済み
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        window.gtag?.('config', gaTrackingId, {
            page_path: location.pathname,
        });
    }, [gaTrackingId, location.pathname]);
};
