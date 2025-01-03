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
            animation: {
                shine: 'shine 1s infinite',
            },
            backgroundImage: {
              'kcz-gradient': 'linear-gradient(90deg, #be4df8 30%, #f760f8 50%, #be4df8 70%)',
            },
            keyframes: {
                shine: {
                    '0%': {
                        backgroundPosition: '100% 50%',
                    },
                    '100%': {
                        backgroundPosition: '0% 50%',
                    },
                },
            },
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
