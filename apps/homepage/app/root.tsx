import { Document, useGtagPageview } from '@hideo54/ui/components/Document';
import { mdxComponents } from '@hideo54/ui/components/mdxComponents';
import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';
import { isRouteErrorResponse, Outlet } from 'react-router';
import type { Route } from './+types/root';
import './global.css';
import PageLayout from './components/Layout';

const gaTrackingId = 'G-HEBV05J7TL';

export const Layout = ({ children }: { children: ReactNode }) => (
    <Document gaTrackingId={gaTrackingId}>
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
    </Document>
);

const App = () => {
    useGtagPageview(gaTrackingId);
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
