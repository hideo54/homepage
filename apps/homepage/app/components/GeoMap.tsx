import clsx from 'clsx';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useMapFrameExpansion } from '../lib/useMapFrameExpansion';
import ZoomableSvg from './ZoomableSvg';

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
    const frameRef = useRef<HTMLDivElement>(null);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);
    const { expanded, changeExpanded } = useMapFrameExpansion();
    const handleZoomedChange = (isZoomed: boolean) => {
        if (isZoomed && !expanded) {
            setPlaceholderHeight(frameRef.current?.offsetHeight ?? 0);
        }
        changeExpanded(isZoomed);
    };

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
        <>
            {expanded && <div style={{ height: placeholderHeight }} />}
            <div
                className={clsx([
                    'bg-sea text-base-content dark:bg-dark-sea',
                    expanded
                        ? 'fixed inset-0 z-50 flex'
                        : ['relative', props.wrapperDivClassName],
                ])}
                id={props.mapId}
                ref={frameRef}
                style={{
                    ...props.style,
                    viewTransitionClass: 'map-frame',
                    // Unique per map, since a page may have several maps.
                    viewTransitionName: `map-${props.mapId}`,
                }}
            >
                <ZoomableSvg
                    captureTouch={expanded}
                    className={clsx([
                        'fill-base-100 stroke-base-content w-full stroke-[0.1px]',
                        expanded ? 'h-full' : 'max-h-200',
                        props.className,
                    ])}
                    onZoomedChange={handleZoomedChange}
                    style={{
                        padding: props.svgPadding,
                    }}
                    title={props.alt}
                    viewBox={props.viewBox}
                >
                    {svgElementChild && (
                        <g
                            ref={ref => {
                                ref?.replaceWith(svgElementChild);
                            }}
                        />
                    )}
                    {props.children}
                </ZoomableSvg>
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
                        <span className='text-3xl font-bold'>
                            {props.count}
                        </span>
                        {props.maxCount && <span> / {props.maxCount}</span>}
                    </p>
                    {props.CountSectionChildren}
                </section>
            </div>
        </>
    );
};

export default GeoMap;
