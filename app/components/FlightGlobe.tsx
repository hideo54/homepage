import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import flightRoutesJson from '../../data/generated/flight-routes.json';
import type { FlightRoutesData } from '../../data/schema/flight-routes';

const { airports, routes } = flightRoutesJson as unknown as FlightRoutesData;

const Globe = lazy(() => import('react-globe.gl'));

const points = Object.entries(airports).map(([code, [lat, lng]]) => ({
    code,
    lat,
    lng,
}));

const FlightGlobe = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<GlobeMethods>(undefined);
    const [width, setWidth] = useState<number>();
    const [isGlobeReady, setIsGlobeReady] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(([entry]) =>
            setWidth(entry.contentRect.width),
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const globe = globeRef.current;
        if (!isGlobeReady || !globe) return;
        const [lat, lng] = airports.HND;
        globe.pointOfView({ lat, lng });
        globe.controls().enableZoom = false;
    }, [isGlobeReady]);

    return (
        <div
            className='aspect-square w-full overflow-hidden bg-black'
            ref={containerRef}
        >
            {width && (
                <Suspense>
                    <Globe
                        arcColor={() => '#ffffff'}
                        arcStroke={0.5}
                        arcsData={routes}
                        backgroundColor='#000000'
                        backgroundImageUrl='https://unpkg.com/three-globe@2.45.0/example/img/night-sky.png'
                        globeImageUrl='https://unpkg.com/three-globe@2.45.0/example/img/earth-night.jpg'
                        height={width}
                        onGlobeReady={() => setIsGlobeReady(true)}
                        pointAltitude={0}
                        pointColor={() => '#ffffff'}
                        pointLabel='code'
                        pointRadius={0.3}
                        pointsData={points}
                        ref={globeRef}
                        width={width}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default FlightGlobe;
