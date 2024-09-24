import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const Map: React.FC<{
    id: string;
    path: string;
    viewBox: string;
    idProvidedByClass?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    fill: {[keys: string]: string};
    count: number;
    maxCount?: number;
    CountSectionChildren?: React.ReactNode;
    wrapperDivClassName?: string;
    additionalCss?: string;
    svgPadding?: string;
}> = props => {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch(props.path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(svgData => {
                setData(svgData);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [props.path]);

    if (loading) return <div className='skeleton h-[600px]' />;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No data</p>;

    const loadedSvg = new DOMParser().parseFromString(data, 'image/svg+xml');
    const svgElementChild = loadedSvg.getElementsByTagName('svg')[0]?.firstElementChild;

    return (
        <div
            id={props.id}
            className={clsx([
                'relative bg-[#a5c1fa] not-prose dark:prose',
                props.wrapperDivClassName,
            ])}
            style={props.style}
        >
            <svg
                viewBox={props.viewBox}
                className={clsx([
                    'w-full max-h-[800px] fill-white stroke-black stroke-[0.2px]',
                    props.className,
                ])}
                style={{
                    padding: props.svgPadding,
                }}
            >
                <g
                    id='loaded'
                    // @ts-expect-error わからん
                    ref={ref => svgElementChild && ref?.replaceWith(svgElementChild)}
                >
                    <div className='skeleton h-full' />
                </g>
                {props.children}
            </svg>
            <style dangerouslySetInnerHTML={{
                __html: (props.additionalCss || '') + Object.entries(props.fill)
                    .map(([prefId, color]) =>
                        `#${props.id} path${props.idProvidedByClass ? '.' : '#'}${prefId}{fill:${color};}`
                    ).join(''),
            }} />
            <section className='absolute top-0 p-2'>
                <p className='m-0'>
                    <span className='text-3xl font-bold'>
                        {props.count}
                    </span>
                    {props.maxCount &&
                        <span> / {props.maxCount}</span>
                    }
                </p>
                {props.CountSectionChildren}
            </section>
        </div>
    );
};

export default Map;
