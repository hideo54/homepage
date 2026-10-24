import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
        tailwindcss(),
        reactRouter(),
    ],
    server: {
        allowedHosts: [
            'snivy.local', // for local debug
        ],
    },
});
