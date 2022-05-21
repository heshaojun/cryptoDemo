const {defineConfig} = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        host: '0.0.0.0',
        port: 8199,
        open: true,
        proxy: {
            '/test': {
                target: 'http://127.0.0.1:9095/',
                changeOrigin: true,
                pathRewrite: {}
            }
        }
    },
    chainWebpack(config) {

        config.plugins.delete('prefetch')

        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        config.module
            .rule('pdf')
            .test(/\.(pdf)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10000
            })
            .end()
    }
})
