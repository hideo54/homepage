import type { ComponentPropsWithoutRef } from 'react';
import type { AppProps } from 'next/app';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import { MDXProvider } from '@mdx-js/react';
import { Open } from '@styled-icons/ionicons-outline';
import './globals.css';

const mdxComponents = {
    a: (props: ComponentPropsWithoutRef<'a'>) =>
        (props.href && props.href.startsWith('/'))
            ? <IconNextLink {...{ ...props, href: props.href } }/>
            : <IconAnchor RightIcon={Open} {...props} />,
};

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <MDXProvider components={mdxComponents}>
            <Component {...pageProps} />
        </MDXProvider>
    );
};

export default App;
