import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Open, ChevronForward, ChevronBack } from '@styled-icons/ionicons-outline';

const WithIconSpan = styled.span<{
    color: string;
}>`
    a, span, svg path {
        color: ${props => props.color};
    }
    a {
        text-decoration: none;
    }
    svg {
        vertical-align: text-bottom;
    }
`;

export const IconLink: React.FC<{
    href: string;
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    color?: string;
    margin?: string;
}> = ({ children, href, LeftIcon, RightIcon, color = '#E26A6A', margin }) => {
    if (href.startsWith('/')) {
        return (
            <WithIconSpan color={color}>
                <Link href={href} passHref>
                    <a>
                        {LeftIcon && <LeftIcon size='1.2em' />}
                        <span style={margin ? { margin: `0 ${margin}` } : undefined}>{children}</span>
                        {RightIcon && <RightIcon size='1.2em' />}
                    </a>
                </Link>
            </WithIconSpan>
        );
    }
    return (
        <WithIconSpan color={color}>
            <a href={href} target='_blank' rel='noopener noreferrer'>
                {LeftIcon && <LeftIcon size='1.2em' />}
                <span style={margin ? { margin: `0 ${margin}` } : undefined}>{children}</span>
                {RightIcon && <RightIcon size='1.2em' />}
            </a>
        </WithIconSpan>
    );
};

export const OpenIconLink: React.FC<{ href: string; }> = ({ children, href }) => (
    <IconLink href={href} RightIcon={Open}>{children}</IconLink>
);

export const GoNextIconLink: React.FC<{ href: string; }> = ({ children, href }) => (
    <IconLink href={href} RightIcon={ChevronForward}>{children}</IconLink>
);

export const GoBackIconLink: React.FC<{ href: string; }> = ({ children, href }) => (
    <IconLink href={href} LeftIcon={ChevronBack}>{children}</IconLink>
);

export const IconText: React.FC<{
    Icon: StyledIcon;
    color?: string;
    margin?: string;
}> = ({ children, Icon, color = '#333333', margin }) => (
    <WithIconSpan color={color}>
        <Icon size='1.2em' />
        <span style={margin ? { margin: `0 ${margin}` } : undefined}>{children}</span>
    </WithIconSpan>
);
