import clsx from 'clsx';
import type React from 'react';
import { useEffect, useState } from 'react';

const GeoMap: React.FC<{
    id: string;
    path: string;
    viewBox: string;
    idProvidedByClass?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    fill: { [keys: string]: string };
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

    if (loading)
        return (
            <div className='h-[600px] animate-pulse bg-neutral-100 dark:bg-neutral-800' />
        );
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No data</p>;

    const loadedSvg = new DOMParser().parseFromString(data, 'image/svg+xml');
    const svgElementChild =
        loadedSvg.getElementsByTagName('svg')[0]?.firstElementChild;

    return (
        <div
            className={clsx([
                'not-prose dark:prose relative bg-[#a5c1fa]',
                props.wrapperDivClassName,
            ])}
            id={props.id}
            style={props.style}
        >
            <svg
                className={clsx([
                    'max-h-[800px] w-full fill-white stroke-[0.2px] stroke-black',
                    props.className,
                ])}
                style={{
                    padding: props.svgPadding,
                }}
                viewBox={props.viewBox}
            >
                <g
                    id='loaded'
                    // @ts-expect-error わからん
                    ref={ref =>
                        svgElementChild && ref?.replaceWith(svgElementChild)
                    }
                >
                    <div className='h-full animate-pulse bg-neutral-100 dark:bg-neutral-800' />
                </g>
                {props.children}
            </svg>
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        (props.additionalCss || '') +
                        Object.entries(props.fill)
                            .map(
                                ([prefId, color]) =>
                                    `#${props.id} path${props.idProvidedByClass ? '.' : '#'}${prefId}{fill:${color};}`,
                            )
                            .join(''),
                }}
            />
            <section className='absolute top-0 p-2'>
                <p className='m-0'>
                    <span className='font-bold text-3xl'>{props.count}</span>
                    {props.maxCount && <span> / {props.maxCount}</span>}
                </p>
                {props.CountSectionChildren}
            </section>
        </div>
    );
};

export default GeoMap;
