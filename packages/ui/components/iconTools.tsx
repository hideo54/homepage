import type React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { Link, type LinkProps } from 'react-router';

export const IconSpan: React.FC<{
    LeftIcon?: IconType;
    RightIcon?: IconType;
    color?: string;
    size?: string;
    fontSize?: string;
    margin?: string;
    verticalAlign?: string;
    children?: ReactNode;
}> = ({
    LeftIcon,
    RightIcon,
    color,
    size,
    fontSize,
    margin,
    verticalAlign = 'text-bottom',
    children,
}) => {
    const contents = (
        <>
            {LeftIcon && (
                <LeftIcon
                    className='inline'
                    size={size || '1.2em'}
                    style={{
                        color,
                        marginRight: '0.1em',
                        verticalAlign,
                    }}
                />
            )}
            {children}
            {RightIcon && (
                <RightIcon
                    className='inline'
                    size={size || '1.2em'}
                    style={{
                        color,
                        marginLeft: '0.1em',
                        verticalAlign,
                    }}
                />
            )}
        </>
    );
    return (
        <span
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

export const IconLink: React.FC<
    ComponentProps<typeof IconSpan> & {
        to: LinkProps['to'];
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
