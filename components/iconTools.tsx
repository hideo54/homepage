import type { StyledIcon } from '@styled-icons/styled-icon';
import Link, { type LinkProps } from 'next/link';
import React, {
    type ComponentProps,
    type MouseEventHandler,
    type ReactNode,
} from 'react';

export const IconSpan: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    color?: string;
    size?: string;
    fontSize?: string;
    margin?: string;
    verticalAlign?: string;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}> = ({
    LeftIcon,
    RightIcon,
    color,
    size,
    fontSize,
    margin,
    verticalAlign = 'text-bottom',
    children,
    onClick,
}) => {
    const contents = (
        <>
            {LeftIcon && (
                <LeftIcon
                    size={size || '1.2em'}
                    style={{
                        color,
                        marginRight: '0.1em',
                        verticalAlign: verticalAlign,
                    }}
                />
            )}
            {children}
            {RightIcon && (
                <RightIcon
                    size={size || '1.2em'}
                    style={{
                        color,
                        marginLeft: '0.1em',
                        verticalAlign: verticalAlign,
                    }}
                />
            )}
        </>
    );
    return (
        <span
            onClick={onClick}
            style={{
                color,
                fontSize,
                margin,
            }}
        >
            {contents}
        </span>
    );
};

export const IconAnchor: React.FC<
    ComponentProps<typeof IconSpan> & {
        href?: string;
    }
> = props => (
    <a
        href={props.href}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            margin: props.margin,
        }}
        {...(!props.href?.startsWith('/') && {
            rel: 'noreferrer noopener',
            target: '_blank',
        })}
    >
        <IconSpan {...props}>{props.children}</IconSpan>
    </a>
);

export const IconNextLink: React.FC<
    ComponentProps<typeof IconSpan> & {
        href: LinkProps['href']; // string | UrlObject
    }
> = props => {
    const { LeftIcon, RightIcon, ...otherProps } = props;
    return (
        <Link {...otherProps}>
            <IconSpan LeftIcon={LeftIcon} RightIcon={RightIcon}>
                {props.children}
            </IconSpan>
        </Link>
    );
};
