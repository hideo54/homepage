// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/lib/gtag.js

export const GA_TRACKING_ID = 'G-HEBV05J7TL';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
    if (typeof window !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_location: url,
        });
    }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    if (typeof window !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};
