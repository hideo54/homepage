import { PropsWithChildren } from 'react';
import { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import { createGlobalStyle } from 'styled-components';
import { ExternalAnchor } from '../src/components';
import { Ul, Li, Code } from '../src/styles';

const mdComponents = {
    a: (props: PropsWithChildren<{ href: string; }>) => <ExternalAnchor {...props} />,
    ul: (props: PropsWithChildren<{ href: string; }>) => <Ul {...props} />,
    li: (props: PropsWithChildren<{ href: string; }>) => <Li {...props} />,
    inlineCode: (props: PropsWithChildren<{}>) => <Code {...props} />,
};

const GlobalStyle = createGlobalStyle`
    body, select {
        font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        margin: 0;
    }

    header, main, footer {
        display: block; /* for IE */
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1em;
    }

    h1, h2, h3, h4, h5, h6, p, div {
        color: #333333;
    }
`;

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <MDXProvider components={mdComponents}>
            <Component {...pageProps} />
            <GlobalStyle />
        </MDXProvider>
    </>
);

export default App;
