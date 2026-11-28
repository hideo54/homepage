import fs from 'node:fs/promises';
import path from 'node:path';
import type { Config } from '@react-router/dev/config';

export default {
    buildEnd: async ({ reactRouterConfig }) => {
        const clientDir = path.join(reactRouterConfig.buildDirectory, 'client');
        await fs.rename(
            path.join(clientDir, '__spa-fallback.html'),
            path.join(clientDir, '404.html'),
        );
    },
    prerender: true,
    ssr: false,
} satisfies Config;
