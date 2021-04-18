import { PropsWithChildren, Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { IoIosArrowForward, IoMdOpen, IoIosArrowBack } from 'react-icons/io';

interface MetaProps {
    title: string;
    description: string;
    url?: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    labels?: [string, string][];
}

export const Meta = (props: MetaProps) => {
    return (
        <Head>
            <title>{props.title}</title>
            <meta key='og:title' property='og:title' content={props.title} />
            <meta key='og:description' property='og:description' content={props.description} />
            {props.url &&
                <meta property='og:url' content={props.url} />
            }
            {props.imageUrl &&
                <meta property='og:image' content={props.imageUrl} />
            }
            <meta key='twitter:card' name='twitter:card' content={props.twitterCardType || 'summary'} />
            <meta key='twitter:site' name='twitter:site' content='@hideo54' />
            <meta key='twitter:creator' name='twitter:creator' content='@hideo54' />
            {props.labels && props.labels.map(([label, data], i) =>
                <Fragment key={i}>
                    <meta key={`twitter:label${i+1}`} name={`twitter:label${i+1}`} content={label} />
                    <meta key={`twitter:data${i+1}`} name={`twitter:data${i+1}`} content={data} />
                </Fragment>
            )}
        </Head>
    );
};

interface SectionProps {
    title?: string;
    href?: string;
    attachReferrer?: boolean;
}

export const Section = (props: PropsWithChildren<SectionProps>) => {
    if (props.href) {
        const child = props.href.startsWith('/')
            ? (
                <h2>
                    <InternalAnchor href={props.href}>
                        <span style={{ verticalAlign: 'middle' }}>{props.title}</span>
                        <IoIosArrowForward style={{ verticalAlign: 'middle' }} />
                    </InternalAnchor>
                </h2>
            )
            : (
                <h2>
                    <ExternalAnchor href={props.href} attachReferrer={props.attachReferrer}>
                        <span style={{ verticalAlign: 'middle' }}>{props.title}</span>
                    </ExternalAnchor>
                </h2>
            );
        return <section style={{ marginBottom: '1em' }}>{child}</section>;
    } else {
        return (
            <section>
                {props.title && <h2>{props.title}</h2>}
                {props.children}
            </section>
        );
    }
};

interface LocalImageProps {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    isRounded?: boolean;
}

export const LocalImage = (props: LocalImageProps) => {
    // Get name from the path.
    // Note: `path.parse()` cannot be used,
    //     for node-libs-browser (webpack's dependency) uses old path-browserify.
    //     This won't be fixed for a while. https://github.com/webpack/node-libs-browser/pull/79
    const base = props.src.split('/')[props.src.split('/').length - 1];
    const name = base.split('.').slice(0, -1).join('.');
    if (props.isRounded !== true) { // undefined (default) or false
        return <img
            src={props.src}
            alt={props.alt ? props.alt : name}
            width={props.width}
            height={props.height}
        />;
    } else {
        return <ImageCircle
            src={props.src}
            alt={props.alt ? props.alt : name}
            width={props.width}
            height={props.height}
        />;
    }
};

interface CustomWordBreakProps {
    separator?: string;
}

export const CustomWordBreak = (props: PropsWithChildren<CustomWordBreakProps>) => {
    const childrenString = props.children?.toString();
    const separator = props.separator || '\\'; // Actually '\'
    const elements = childrenString?.split(separator).map(str => (
        <span key={str}>
            <span>{str}</span>
            <wbr />
        </span>
    ));
    return <ParagraphWithoutWrap>{elements}</ParagraphWithoutWrap>;
};

export const UnorderedList = (props: { list: any[]; }) => (
    <Ul>
        {props.list.map((li, i) => <Li key={i}>{li}</Li>)}
    </Ul>
);

export const InternalAnchor = (props: PropsWithChildren<{ href: string; }>) => (
    <Link href={props.href}>
        <Anchor>{props.children}</Anchor>
    </Link>
);

interface ExternalAnchorProps {
    href: string;
    showOpenIcon?: boolean;
    openInNewTab?: boolean;
    attachReferrer?: boolean;
    isInlineBlock?: boolean;
}

export const ExternalAnchor = (props: PropsWithChildren<ExternalAnchorProps>) => {
    const showOpenIcon = props.showOpenIcon === undefined ? true : props.showOpenIcon;
    const openInNewTab = props.openInNewTab === undefined ? true : props.openInNewTab;
    const attachReferrer = props.attachReferrer === undefined ? false : props.attachReferrer;
    const isInlineBlock = props.isInlineBlock === undefined ? false : props.isInlineBlock;
    const target = openInNewTab ? '_blank' : undefined;
    const rel = attachReferrer ? 'noopener' : 'noreferrer'; // https://web.dev/external-anchors-use-rel-noopener/
    return (
        <Anchor
            href={props.href} target={target} rel={rel}
            style={isInlineBlock ? {display: 'inline-block'} : undefined}
        >
            <span style={{ verticalAlign: 'middle' }}>{props.children}</span>
            {showOpenIcon &&
                <IoMdOpen style={{
                    verticalAlign: 'middle',
                    marginLeft: '.2em',
                }} />
            }
        </Anchor>
    );
};

export const GoTopHeader = () => {
    const height = '2em';
    return (
        <Header>
            <InternalAnchor href='/'>
                <IoIosArrowBack style={{
                    width: height,
                    height: height,
                    marginLeft: '-2em',
                    verticalAlign: 'middle',
                }} />
                <span style={{
                    fontSize: height,
                    verticalAlign: 'middle',
                }}>hideo54.com TOP</span>
            </InternalAnchor>
        </Header>
    );
};

export interface TagProps {
    color: string;
    name: string;
    username: string;
    link?: string;
}

export const Tag = (props: TagProps) => {
    const block = (
        <TagBlock>
            <Circle diameter='1.5em' color={props.color} />
            <TwoParagraphBlock>
                <p>{props.name}</p>
                <p>{props.username}</p>
            </TwoParagraphBlock>
        </TagBlock>
    );
    if (props.link) {
        return (
            <ExternalAnchor href={props.link} showOpenIcon={false} isInlineBlock={true}>
                {block}
            </ExternalAnchor>
        );
    }
    return block;
};

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

export const Header = styled.header`
    max-width: ${maxWidth};
    margin: 0 auto;
    padding: 0 1em;
    /* For IE */
    display: block;
`;

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
