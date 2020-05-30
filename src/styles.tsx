import styled from 'styled-components';

const accentColor = '#E26A6A';

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