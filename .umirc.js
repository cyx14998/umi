import { resolve } from 'path';
export default {
    proxy: {
        "/api/v1/weather": {
            "target": "https://api.seniverse.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
        },
        "/gateway/": {
            "target": "https://eapi.ciwong.com/",
            "changeOrigin": true,
        },
        "/proxy/": {
            "target": "http://192.168.16.209:3127/",
            "changeOrigin": true,
        }
    },
    alias: {
        components: resolve(__dirname, "./src/components"),
        models: resolve(__dirname, "./src/models"),
        services: resolve(__dirname, "./src/services"),
        themes: resolve(__dirname, './src/themes'),
        utils: resolve(__dirname, "./src/utils"),
        img: resolve(__dirname, "./src/img"),
        // config: resolve(__dirname, "./src/utils/config"),
        // enums: resolve(__dirname, "./src/utils/enums"),
        // routes: resolve(__dirname, "./src/routes"),
    },
    history: 'hash',
    plugins: [
        ['umi-plugin-react', {
            antd: true,
            dva: true
        }]
    ],
    urlLoaderExcludes: [
        /\.svg$/,
    ],
    ignoreMomentLocale: true,
    theme: {
        "border-color-base": "#d9d9d9",
        'border-color-split': '#d9d9d9'
    },
    targets: {
        ie: 9,
    },
    base: '/',
    publicPath: '/'
}