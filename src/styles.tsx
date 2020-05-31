import styled from 'styled-components';

export const color = {
    text: '#1D1D1F', // Respect Apple
    accent: '#E26A6A',
    cloud: '#ECF0F1',
};

export const fonts = {
    sansSerif: [
        '-apple-system', 'BlinkMacSystemFont',
        'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'sans-serif',
    ],
    monospace: [
        'Ricty', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace',
    ],
};

const maxWidth = '800px';

export const Main = styled.main`
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 0 1em;
    /* For IE */
    display: block;
`;

export const Footer = styled.footer`
    max-width: ${maxWidth};
    margin: 0 auto;
    margin-top: 2em;
    padding: 0 1em;
    /* For IE */
    display: block;
`;

export const RoundImage = styled.img`
    border-radius: 50%;
`;

export const BigTitle = styled.h1``;

export const H2 = styled.h2`
    margin: .1em 0;
`;

export const Center = styled.div`
    margin: 1em auto;
    text-align: center;
`;

export const ParagraphWithoutWrap = styled.p`
    white-space: nowrap;
`;

export const Anchor = styled.a`
    color: ${color.accent};
    cursor: pointer;
    text-decoration: none;
    /* text-decoration: underline dashed */
    /* text-underline-position: under; */
`;

export const Small = styled.small`
    color: gray;
`;

export const Code = styled.code`
    padding: 0.2em 0.5em;
    background-color: ${color.cloud};
    font-family: ${fonts.monospace.join(',')};
    word-break: break-all;
    border-radius: 0.3em;
`;

export const Ul = styled.ul`
    margin-top: 0;
`;

export const Li = styled.li`
    margin: .5em 0;
`;