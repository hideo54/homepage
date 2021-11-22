import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body, select {
        font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        margin: 0;

        @media (prefers-color-scheme: dark) {
            background-color: #000000;
        }
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
        color: '#333333';

        @media (prefers-color-scheme: dark) {
            color: #EEEEEE;
        }

        a :not(&) {
            color: #e26a6a;
        }
    }

    li {
        line-height: 1.8;
    }

    code {
        font-family: Ricty, 'Ricty Diminished', 'Courier New', Courier, monospace;
        font-size: 1.2em;
        background-color: #EEEEEE;
        padding: 0 0.2em;
        border-radius: 0.2em;

        @media (prefers-color-scheme: dark) {
            background-color: #666666;
        }
    }
`;

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
            <GlobalStyle />
        </>
    );
};

export default App;
