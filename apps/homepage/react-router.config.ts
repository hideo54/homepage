import fs from 'node:fs/promises';
import path from 'node:path';
import type { Config } from '@react-router/dev/config';
import { optimize } from 'svgo';

const minifySvgs = async (dir: string) => {
    for await (const file of fs.glob('**/*.svg', { cwd: dir })) {
        const filePath = path.join(dir, file);
        const svg = await fs.readFile(filePath, 'utf-8');
        const { data } = optimize(svg, {
            multipass: true,
            plugins: [
                {
                    name: 'preset-default',
                    params: {
                        // GeoMap は id/class を CSS セレクタに使い、ルート svg の firstElementChild を取り出すので、構造を変えない
                        overrides: {
                            cleanupIds: false,
                            collapseGroups: false,
                            convertShapeToPath: false,
                            mergePaths: false,
                        },
                    },
                },
            ],
        });
        await fs.writeFile(filePath, data);
    }
};

export default {
    buildEnd: async ({ reactRouterConfig }) => {
        const clientDir = path.join(reactRouterConfig.buildDirectory, 'client');
        // Workers の not_found_handling: "404-page" に拾わせる
        await fs.rename(
            path.join(clientDir, '__spa-fallback.html'),
            path.join(clientDir, '404.html'),
        );
        await minifySvgs(clientDir);
    },
    prerender: true,
    ssr: false,
} satisfies Config;
