import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

type Theme = 'light' | 'dark';

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
    body, select {
        font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        margin: 0;
        background-color: ${props => props.theme === 'light' ? '#FFFFFF' : '#000000'};
    }

    header, main, footer {
        display: block; /* for IE */
    }

    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1em;
    }

    h1, h2, h3, h4, h5, h6, p, div {
        margin-top: 0;
        color: ${props => props.theme === 'light' ? '#333333' : '#EEEEEE'};
    }

    li {
        line-height: 1.8;
    }

    code {
        font-family: Ricty, 'Ricty Diminished', 'Courier New', Courier, monospace;
        font-size: 1.2em;
        background-color: ${props => props.theme === 'light' ? '#EEEEEE' : '#666666'};
        padding: 0 0.2em;
        border-radius: 0.2em;
    }
`;

const App = ({ Component, pageProps }: AppProps) => {
    const [theme, setTheme] = useState<Theme>('light');
    useEffect(() => {
        if (typeof 'window' === undefined) return;
        if (!('matchMedia' in window)) return;
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        if (query.matches) {
            setTheme('dark');
        }
        query.onchange = () => {
            setTheme(query.matches ? 'dark' : 'light');
        };
    }, []);
    return (
        <>
            <Component {...pageProps} />
            <GlobalStyle theme={theme} />
        </>
    );
};

export default App;
