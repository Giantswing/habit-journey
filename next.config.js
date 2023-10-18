/** @type {import('next').NextConfig} */

const nextTranslate = require("next-translate-plugin");

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


module.exports = withBundleAnalyzer(nextTranslate(nextConfig));
