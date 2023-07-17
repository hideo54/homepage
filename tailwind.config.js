/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'hideo54-pink': '#e26a6a',
            },
            fontFamily: {
                sans: [
                    '-apple-system', 'BlinkMacSystemFont',
                    'Hiragino Sans', 'var(--font-noto)',
                    'sans-serif',
                ],
            },
            fontWeight: {
                inherit: 'inherit',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
