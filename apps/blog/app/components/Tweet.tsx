import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        twttr?: { widgets: { load: (element?: HTMLElement) => void } };
    }
}

const widgetsSrc = 'https://platform.twitter.com/widgets.js';

const Tweet = ({ url }: { url: string }) => {
    const ref = useRef<HTMLQuoteElement>(null);
    useEffect(() => {
        if (window.twttr) {
            window.twttr.widgets.load(ref.current ?? undefined);
            return;
        }
        if (document.querySelector(`script[src='${widgetsSrc}']`)) return;
        const script = document.createElement('script');
        script.src = widgetsSrc;
        script.async = true;
        document.body.append(script);
    }, []);
    return (
        <blockquote className='twitter-tweet' ref={ref}>
            <a href={url}>{url}</a>
        </blockquote>
    );
};

export default Tweet;
