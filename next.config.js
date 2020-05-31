const withMDX = require('@next/mdx')();
module.exports = withMDX({
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.ya?ml$/,
            type: 'json',
            use: 'yaml-loader',
        });
        return config;
    },
    pageExtensions: [ 'tsx', 'mdx' ],
});