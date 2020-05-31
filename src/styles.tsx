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

export const Center = styled.div`
    margin: 1em auto;
    text-align: center;
`;

export const ParagraphWithoutWrap = styled.p`
    white-space: nowrap;
`;

export const TagBlock = styled.div`
    display: inline-block;
    margin: 0.5em;
    border-radius: 1em;
    vertical-align: middle;
    background-color: ${color.cloud};
`;

export const TwoParagraphBlock = styled.div`
    display: inline-block;
    padding-right: 0.5em;
    vertical-align: middle;
`;

interface CircleProps {
    color: string;
    diameter: string;
}

export const Circle = styled.div`
    display: inline-block;
    width: ${(props: CircleProps) => props.diameter};
    height: ${(props: CircleProps) => props.diameter};
    margin: 0.5em;
    border-radius: 50%;
    background-color: ${(props: CircleProps) => props.color};
    vertical-align: middle;
`;

export const ImageCircle = styled.img`
    border-radius: 50%;
`;