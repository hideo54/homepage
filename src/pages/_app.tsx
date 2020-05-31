import { PropsWithChildren } from 'react';
import { AppProps } from 'next/app'
import { MDXProvider } from '@mdx-js/react';
import { ExternalAnchor } from '../components';
import { Main, H1, H2, Code } from '../styles';

const mdComponents = {
    h1: (props: PropsWithChildren<{}>) => <H1 {...props} />,
    h2: (props: PropsWithChildren<{}>) => <H2 {...props} />,
    a: (props: PropsWithChildren<{ href: string; }>) => <ExternalAnchor {...props} />,
    code: (props: PropsWithChildren<{}>) => <Code {...props} />,
};

const App = ({ Component, pageProps }: AppProps) => (
    <Main>
        <MDXProvider components={mdComponents}>
            <Component {...pageProps} />
        </MDXProvider>
    </Main>
);

export default App;