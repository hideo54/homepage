import React, { type MouseEventHandler, type ComponentProps, type ReactNode } from 'react';
import Link, { type LinkProps } from 'next/link';
import type { StyledIcon } from '@styled-icons/styled-icon';

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
    const contents = <>
        {LeftIcon &&
            <LeftIcon
                size={size || '1.2em'}
                style={{
                    color,
                    verticalAlign: verticalAlign,
                    marginRight: '0.1em',
                }}
            />
        }
        {children}
        {RightIcon &&
            <RightIcon
                size={size || '1.2em'}
                style={{
                    color,
                    verticalAlign: verticalAlign,
                    marginLeft: '0.1em',
                }}
            />
        }
    </>;
    return (
        <span
            style={{
                color,
                fontSize,
                margin,
            }}
            onClick={onClick}
        >
            {contents}
        </span>
    );
};

export const IconAnchor: React.FC<ComponentProps<typeof IconSpan> & {
    href?: string;
}> = props => (
    <a
        href={props.href}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            margin: props.margin,
        }}
        {...!props.href?.startsWith('/') && {
            target: '_blank',
            rel: 'noreferrer noopener',
        }}
    >
        <IconSpan {...props}>
            {props.children}
        </IconSpan>
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
