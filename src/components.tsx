import { PropsWithChildren } from 'react';
import { IoMdOpen } from 'react-icons/io';
import { RoundImage, ParagraphWithoutWrap, H2, Anchor, Ul, Li } from './styles';

export const Section = (props: PropsWithChildren<{ title?: string }>) => (
    <section>
        {props.title && <H2>{props.title}</H2>}
        {props.children}
    </section>
);

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
        return <RoundImage
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
    const elements = childrenString?.split(separator).map(str => <>
        <span>{str}</span>
        <wbr />
    </>);
    return <ParagraphWithoutWrap>{elements}</ParagraphWithoutWrap>;
};

export const UnorderedList = (props: { list: any[]; }) => (
    <Ul>
        {props.list.map((li, i) => <Li key={i}>{li}</Li>)}
    </Ul>
);

interface ExternalAnchorInterface {
    href: string;
    openInNewTab?: boolean;
    attachReferrer?: boolean;
}

export const ExternalAnchor = (props: PropsWithChildren<ExternalAnchorInterface>) => {
    const openInNewTab = props.openInNewTab === undefined ? true : props.openInNewTab;
    const target = openInNewTab ? '_blank' : undefined;
    // About rel, see: https://web.dev/external-anchors-use-rel-noopener/
    if (props.attachReferrer) {
        return (
            <Anchor href={props.href} target={target} rel='noopener'>
                {props.children}
                <IoMdOpen style={{verticalAlign: 'text-bottom', marginLeft: '.2em'}} />
            </Anchor>
        );
    } else {
        return (
            <Anchor href={props.href} target={target} rel='noreferrer'>
                {props.children}
                <IoMdOpen style={{verticalAlign: 'text-bottom', marginLeft: '.2em'}} />
            </Anchor>
        );
    }
};