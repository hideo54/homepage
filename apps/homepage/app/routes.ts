import {
    index,
    prefix,
    type RouteConfig,
    route,
} from '@react-router/dev/routes';

export default [
    index('routes/index.mdx'),
    route('accounts', 'routes/accounts.tsx'),
    route('activity', 'routes/activity.mdx'),
    route('intro', 'routes/intro.mdx'),
    route('karaoke', 'routes/karaoke.tsx'),
    route('maimai', 'routes/maimai.tsx'),
    route('pay', 'routes/pay.mdx'),
    route('resume', 'routes/resume.mdx'),
    route('visits', 'routes/visits.tsx'),
    route('works', 'routes/works.tsx'),
    ...prefix('en', [
        index('routes/en/index.mdx'),
        route('cv', 'routes/en/cv.mdx'),
    ]),
] satisfies RouteConfig;
