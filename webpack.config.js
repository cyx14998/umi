import { resolve } from 'path';

export default {
    theme: "./theme.config.js",
    // 接口代理示例
    proxy: {
        "/api/v1/weather": {
            "target": "https://api.seniverse.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
        },
        "/sjyk/": {
            "target": "http://192.168.1.167/",
            "changeOrigin": true,
        }
    },
    alias: {
        // components: resolve(__dirname, "./src/components"),
        // models: resolve(__dirname, "./src/models"),
        // services: resolve(__dirname, "./src/services"),
        // themes: resolve(__dirname, './src/themes'),
        utils: resolve(__dirname, "./src/utils"),
        // config: resolve(__dirname, "./src/utils/config"),
        // enums: resolve(__dirname, "./src/utils/enums"),
        // routes: resolve(__dirname, "./src/routes"),
        // img: resolve(__dirname, "./src/img"),
    },
    urlLoaderExcludes: [
        /\.svg$/,
    ],
    ignoreMomentLocale: true,
    theme: {
        "border-color-base": "#d9d9d9",
        'border-color-split': '#d9d9d9'
    },
}
