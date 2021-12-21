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
    }
}