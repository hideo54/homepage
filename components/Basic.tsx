import styled from 'styled-components';
import InternalLink from 'next/link';

const CenterAlignedSection = styled.section``;
const LeftAlignedSection = styled.section``;

interface SectionProps {
  children?;
  title?: string;
  href?: string;
  center?: boolean;
}

export const Section = (props: SectionProps) => (
  props.href
    ? <LeftAlignedSection>
        <Link href={props.href}>
          <Title>{props.title}</Title>
        </Link>
      </LeftAlignedSection>
    : props.center
      ? <CenterAlignedSection>
          <Title>{props.title}</Title>
          {props.children}
        </CenterAlignedSection>
      : <LeftAlignedSection>
          <Title>{props.title}</Title>
          {props.children}
        </LeftAlignedSection>
);

export const LargetTitle = styled.h1``;

export const Title = styled.h2``;

export const Paragraph = styled.p``;

const UnorderedList = styled.ul``;

const OrderedList = styled.ol``;

export const List = ({ children, ordered = false }) => (
  ordered
    ? <OrderedList>{children}</OrderedList>
    : <UnorderedList>{children}</UnorderedList>
);

const ExternalLink = styled.a``;

interface LinkProps {
  children: React.ReactChild;
  href: string;
}

export const Link = (props: LinkProps) => (
  props.href.startsWith('/')
    ? <InternalLink href={props.href}>{props.children}</InternalLink>
    : <ExternalLink href={props.href} target='_blank' rel='noopener'>
        {props.children}
      </ExternalLink>
);