import { PropsWithChildren } from 'react';
import { RoundImage, ParagraphWithoutWrap, Anchor } from './styles';

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
    <ul>
        {props.list.map(li => <li>{li}</li>)}
    </ul>
);

export const ExternalAnchor = (props: PropsWithChildren<{ href: string }>) => (
    <Anchor href={props.href} target='_blank' rel='noreferrer' >
        {props.children}
    </Anchor>
);