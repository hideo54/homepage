import styled from 'styled-components';

const accentColor = '#E26A6A';

const maxWidth = '800px';

export const Main = styled.main`
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 1em;
    /* For IE */
    display: block;
`;

export const Footer = styled.footer`
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 1em;
    /* For IE */
    display: block;
`;

export const RoundImage = styled.img`
    border-radius: 50%;
`;

export const BigTitle = styled.h1``;

export const Center = styled.div`
    margin: 0 auto;
    text-align: center;
`;

export const ParagraphWithoutWrap = styled.p`
    white-space: nowrap;
`;

export const Anchor = styled.a`
    color: ${accentColor};
    text-decoration: none;
    /* text-decoration: underline dashed */
    text-underline-position: under;
`;

export const Small = styled.small`
    color: gray;
`;