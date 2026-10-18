import { ChevronForward, Open } from '@styled-icons/ionicons-outline';
import clsx from 'clsx';
import React, { type ComponentPropsWithoutRef } from 'react';
import { IconAnchor, IconLink } from './components/iconTools';

export const mdxComponents = {
    a: (
        props: ComponentPropsWithoutRef<'a'> & {
            hasH2Parent?: boolean;
        },
    ) => {
        const { hasH2Parent, href, ...rest } = props;
        return href?.startsWith('/') ? (
            <IconLink
                {...rest}
                RightIcon={hasH2Parent ? ChevronForward : undefined}
                to={href}
            />
        ) : (
            <IconAnchor RightIcon={Open} {...rest} href={href} />
        );
    },
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote
            {...props}
            className={clsx('typography-blockquote', props.className)}
        />
    ),
    code: (props: ComponentPropsWithoutRef<'code'>) => (
        <code {...props} className={clsx('typography-code', props.className)} />
    ),
    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
        <h1 {...props} className={clsx('typography-h1', props.className)} />
    ),
    h2: (props: ComponentPropsWithoutRef<'h2'>) => {
        const className = clsx('typography-h2', props.className);
        return (
            // @ts-expect-error 許してくれ…
            props.children?.props && 'href' in props.children.props ? (
                // h2 の children に hasH2Parent を追加する
                <h2 {...props} className={className}>
                    {/* @ts-expect-error 許してくれ… */}
                    {React.cloneElement(props.children, { hasH2Parent: true })}
                </h2>
            ) : (
                <h2 {...props} className={className} />
            )
        );
    },
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
        <h3 {...props} className={clsx('typography-h3', props.className)} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
        <h4 {...props} className={clsx('typography-h4', props.className)} />
    ),
    h5: (props: ComponentPropsWithoutRef<'h5'>) => (
        <h5 {...props} className={clsx('typography-h5', props.className)} />
    ),
    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
        <hr {...props} className={clsx('typography-hr', props.className)} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
        <ol {...props} className={clsx('typography-list', props.className)} />
    ),
    p: (props: ComponentPropsWithoutRef<'p'>) => (
        <p {...props} className={clsx('typography-p', props.className)} />
    ),
    pre: (props: ComponentPropsWithoutRef<'pre'>) => (
        <pre {...props} className={clsx('typography-pre', props.className)} />
    ),
    table: (props: ComponentPropsWithoutRef<'table'>) => (
        <table
            {...props}
            className={clsx('typography-table', props.className)}
        />
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
        <ul {...props} className={clsx('typography-list', props.className)} />
    ),
};
