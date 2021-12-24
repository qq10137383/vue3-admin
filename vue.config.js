'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    chainWebpack: config => {
        // 打开source-map，方便调试
        config.devtool('source-map')

        // 解决element-plus报错的问题
        config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .type('javascript/auto')
            .include.add(/node_modules/)
            .end()

        // 默认处理svg的url-loader排除src/icons目录，使用svg-sprite-loader加载
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()

        // 配置svg-sprite-loader处理svg
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
    }
}