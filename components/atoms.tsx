import Link from 'next/link';
import styled from 'styled-components';
import type { StyledIcon } from '@styled-icons/styled-icon';
import { Open, ChevronForward, ChevronBack } from '@styled-icons/ionicons-outline';

const LinkSpan = styled.span`
    a {
        color: #E26A6A;
        text-decoration: none;
    }
    svg {
        vertical-align: text-bottom;
        path {
            stroke: #E26A6A;
        }
    }
`;

const IconLink: React.FC<{
    href: string;
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
}> = ({ children, href, LeftIcon, RightIcon }) => {
    if (href.startsWith('/')) {
        return (
            <LinkSpan>
                <Link href={href} passHref>
                    <a>
                        {LeftIcon && <LeftIcon size='1.2em' />}
                        {children}
                        {RightIcon && <RightIcon size='1.2em' />}
                    </a>
                </Link>
            </LinkSpan>
        );
    }
    return (
        <LinkSpan>
            <a href={href} target='_blank' rel='noopener noreferrer'>
                {LeftIcon && <LeftIcon size='1.2em' />}
                {children}
                {RightIcon && <RightIcon size='1.2em' />}
            </a>
        </LinkSpan>
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
