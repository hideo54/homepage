const withMDX = require('@next/mdx')();
module.exports = withMDX({
    output: 'export',
    pageExtensions: ['ts', 'tsx', 'mdx'],
    webpack(config) {
        config.module.rules.push({
            issuer: /\.[jt]sx?$/,
            test: /\.svg$/i,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        ref: true,
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'cleanupIds',
                                    params: {
                                        remove: false,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        });
        return config;
    },
});
