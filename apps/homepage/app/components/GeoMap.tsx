import clsx from 'clsx';
import type React from 'react';
import { useEffect, useState } from 'react';

const GeoMap: React.FC<{
    mapId: string;
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
    alt: string;
}> = props => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        fetch(props.path)
            .then(response => response.text())
            .then(setData);
    }, [props.path]);

    const svgElementChild = data
        ? new DOMParser()
              .parseFromString(data, 'image/svg+xml')
              .getElementsByTagName('svg')[0]?.firstElementChild
        : null;

    return (
        <div
            className={clsx([
                'relative bg-sea text-base-content dark:bg-dark-sea',
                props.wrapperDivClassName,
            ])}
            id={props.mapId}
            style={props.style}
        >
            <svg
                className={clsx([
                    'max-h-200 w-full fill-base-100 stroke-[0.1px] stroke-base-content',
                    props.className,
                ])}
                style={{
                    padding: props.svgPadding,
                }}
                viewBox={props.viewBox}
            >
                <title>{props.alt}</title>
                {svgElementChild && (
                    <g
                        ref={ref => {
                            ref?.replaceWith(svgElementChild);
                        }}
                    />
                )}
                {props.children}
            </svg>
            {!data && (
                <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='loading loading-spinner loading-lg' />
                </div>
            )}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        (props.additionalCss || '') +
                        Object.entries(props.fill)
                            .map(
                                ([prefId, color]) =>
                                    `#${props.mapId} path${props.idProvidedByClass ? '.' : '#'}${prefId}{fill:${color};}`,
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
