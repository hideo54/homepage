import { useGesture } from '@use-gesture/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { IoContract } from 'react-icons/io5';

type Transform = { x: number; y: number; k: number };
type Point = { x: number; y: number };

const identity: Transform = { k: 1, x: 0, y: 0 };

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

// Zooms and pans by pinch. Wheel scrolls and one-finger drags are always left to the page's native scroll (touch-action), so the page never sticks on the map.
// Mouse drags pan the map while zoomed, and so do touch drags while `captureTouch` is set (e.g. when the map covers the whole screen).
// The reset button is positioned absolutely, so the parent should be positioned.
// Children can keep their stroke width on screen with `calc(<width>px / var(--zoom, 1))`.
const ZoomableSvg: React.FC<{
    viewBox: string;
    // Placed outside the zoomed group, so it names the whole SVG.
    title: string;
    maxScale?: number;
    // How far the map moves per pixel of a drag. Above 1, it outruns the pointer to cover the zoomed map quickly.
    panSpeed?: number;
    className?: string;
    captureTouch?: boolean;
    // Called when a pinch ends or the zoom is reset, not on every frame.
    onZoomedChange?: (isZoomed: boolean) => void;
    children: ReactNode;
}> = ({
    viewBox,
    title,
    maxScale = 16,
    panSpeed = 1.4,
    className,
    captureTouch = false,
    onZoomedChange,
    children,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const groupRef = useRef<SVGGElement>(null);
    const transformRef = useRef<Transform>(identity);
    const suppressClickRef = useRef(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const constrain = ({ x, y, k }: Transform): Transform => {
        const [minX, minY, width, height] = viewBox.split(' ').map(parseFloat);
        return {
            k,
            x: clamp(x, (minX + width) * (1 - k), minX * (1 - k)),
            y: clamp(y, (minY + height) * (1 - k), minY * (1 - k)),
        };
    };

    // Written to the DOM directly, since re-rendering every child per frame is too slow on phones.
    const applyTransform = (transform: Transform) => {
        transformRef.current = transform;
        setIsZoomed(transform.k > 1);
        const group = groupRef.current;
        if (!group) return;
        group.setAttribute(
            'transform',
            `translate(${transform.x} ${transform.y}) scale(${transform.k})`,
        );
        group.style.setProperty('--zoom', String(transform.k));
    };

    const toSvgPoint = ([clientX, clientY]: [number, number]) => {
        const matrix = svgRef.current?.getScreenCTM()?.inverse();
        if (!matrix) return undefined;
        const { x, y } = new DOMPoint(clientX, clientY).matrixTransform(matrix);
        return { x, y };
    };

    const panByPixels = (dx: number, dy: number) => {
        const pixelsPerUnit = svgRef.current?.getScreenCTM()?.a;
        const current = transformRef.current;
        if (!pixelsPerUnit) return current;
        return constrain({
            k: current.k,
            x: current.x + dx / pixelsPerUnit,
            y: current.y + dy / pixelsPerUnit,
        });
    };

    useEffect(() => {
        applyTransform(identity);
    }, [viewBox]);

    useGesture(
        {
            onDrag: ({
                event,
                pinching,
                cancel,
                delta: [dx, dy],
                last,
                tap,
            }) => {
                const isTouch =
                    'pointerType' in event && event.pointerType === 'touch';
                if (
                    (isTouch && !captureTouch) ||
                    pinching ||
                    transformRef.current.k === 1
                ) {
                    cancel();
                    return;
                }
                applyTransform(panByPixels(dx * panSpeed, dy * panSpeed));
                if (last && !tap) suppressClickRef.current = true;
            },
            onPinch: ({ first, last, origin, offset: [k], memo }) => {
                if (last) onZoomedChange?.(k > 1);
                const point = toSvgPoint(origin);
                if (!point) return memo;
                const current = transformRef.current;
                // The content point under the fingers, kept under them while pinching
                const anchor: Point =
                    first || !memo
                        ? {
                              x: (point.x - current.x) / current.k,
                              y: (point.y - current.y) / current.k,
                          }
                        : memo;
                applyTransform(
                    constrain({
                        k,
                        x: point.x - k * anchor.x,
                        y: point.y - k * anchor.y,
                    }),
                );
                return anchor;
            },
        },
        {
            drag: { filterTaps: true },
            pinch: {
                from: () => [transformRef.current.k, 0],
                scaleBounds: { max: maxScale, min: 1 },
            },
            target: svgRef,
        },
    );

    return (
        <>
            <svg
                className={className}
                onClickCapture={event => {
                    if (!suppressClickRef.current) return;
                    suppressClickRef.current = false;
                    event.stopPropagation();
                    event.preventDefault();
                }}
                ref={svgRef}
                style={{ touchAction: captureTouch ? 'none' : 'pan-x pan-y' }}
                viewBox={viewBox}
            >
                <title>{title}</title>
                <g ref={groupRef}>{children}</g>
            </svg>
            {isZoomed && (
                <button
                    aria-label='ズームをリセット'
                    className='btn btn-square btn-xl absolute right-4 bottom-4'
                    onClick={() => {
                        onZoomedChange?.(false);
                        applyTransform(identity);
                    }}
                    type='button'
                >
                    <IoContract size='2em' />
                </button>
            )}
        </>
    );
};

export default ZoomableSvg;
