import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

// Covers the screen with a map frame while `expanded`. Pass `changeExpanded` to ZoomableSvg's onZoomedChange.
export const useMapFrameExpansion = () => {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (!expanded) return;
        const root = document.documentElement;
        root.style.overflow = 'hidden';
        return () => {
            root.style.overflow = '';
        };
    }, [expanded]);
    const changeExpanded = (next: boolean) => {
        if (next === expanded) return;
        if (!document.startViewTransition) {
            setExpanded(next);
            return;
        }
        document.startViewTransition(() => flushSync(() => setExpanded(next)));
    };
    return { changeExpanded, expanded };
};
