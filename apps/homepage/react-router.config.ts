import fs from 'node:fs/promises';
import path from 'node:path';
import type { Config } from '@react-router/dev/config';

export default {
    // Workers の not_found_handling: "404-page" に拾わせる
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
