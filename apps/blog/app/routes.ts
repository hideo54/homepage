import fs from 'node:fs';
import path from 'node:path';
import { layout, type RouteConfig, route } from '@react-router/dev/routes';

const ids = fs
    .readdirSync(path.join(import.meta.dirname, 'archives'))
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.basename(file, '.mdx'));

export default [
    layout(
        'routes/article-layout.tsx',
        ids.map(id => route(`archives/${id}`, `archives/${id}.mdx`)),
    ),
] satisfies RouteConfig;
