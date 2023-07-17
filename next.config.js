const withMDX = require('@next/mdx')();
module.exports = withMDX({
    pageExtensions: ['ts', 'tsx', 'mdx'],
    output: 'export',
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{
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
            }],
        });
        return config;
    },
});
