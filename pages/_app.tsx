import { PropsWithChildren } from 'react';
import { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import { Meta, ExternalAnchor } from '../src/components';
import { Main, Ul, Li, Code } from '../src/styles';

const mdComponents = {
    a: (props: PropsWithChildren<{ href: string; }>) => <ExternalAnchor {...props} />,
    ul: (props: PropsWithChildren<{ href: string; }>) => <Ul {...props} />,
    li: (props: PropsWithChildren<{ href: string; }>) => <Li {...props} />,
    inlineCode: (props: PropsWithChildren<{}>) => <Code {...props} />,
};

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <Meta
            title='hideo54.com'
            description='hideo54のホームページです。'
            imageUrl='https://hideo54.com/icon-main.png'
        />
        <Main>
            <MDXProvider components={mdComponents}>
                <Component {...pageProps} />
            </MDXProvider>
        </Main>
    </>
);

export default App;
