import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { IoIosArrowForward, IoMdOpen, IoIosArrowBack } from 'react-icons/io';
import {
    Header, Anchor, Ul, Li,
    ParagraphWithoutWrap, TagBlock, TwoParagraphBlock, Circle, ImageCircle,
} from './styles';

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
                        {props.title}
                        <IoIosArrowForward style={{ verticalAlign: 'middle' }} />
                    </InternalAnchor>
                </h2>
            )
            : (
                <h2>
                    <ExternalAnchor href={props.href} attachReferrer={props.attachReferrer}>
                        {props.title}
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
}

export const ExternalAnchor = (props: PropsWithChildren<ExternalAnchorProps>) => {
    const showOpenIcon = props.showOpenIcon === undefined ? true : props.showOpenIcon;
    const openInNewTab = props.openInNewTab === undefined ? true : props.openInNewTab;
    const attachReferrer = props.attachReferrer === undefined ? false : props.attachReferrer;
    const target = openInNewTab ? '_blank' : undefined;
    const rel = attachReferrer ? 'noopener' : 'noreferrer'; // https://web.dev/external-anchors-use-rel-noopener/
    return (
        <Anchor href={props.href} target={target} rel={rel} >
            {props.children}
            {showOpenIcon &&
                <IoMdOpen style={{
                    verticalAlign: 'text-bottom',
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
            <ExternalAnchor href={props.link} showOpenIcon={false}>
                {block}
            </ExternalAnchor>
        );
    }
    return block;
};