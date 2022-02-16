'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    // 保存时执行eslint检查
    lintOnSave: true,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        // 启动前先启动api服务
        before: require('./mock/mock-server.js')
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production';
            // 打包文件大小配置
            config.performance = {
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000
            }
        }
    },
    chainWebpack: config => {
        // 打开source-map，方便调试
        config.devtool('source-map')

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
    },
    // babel编译node_module/element-plus模块，解决element-plus导入报错的问题
    // 默认情况下babel-loader会忽略所有node_modules中的文件，导入element-plus
    // 包时定义了module入口，使用mjs文件(es模块)，需要babel转译为cjs
    transpileDependencies: ['element-plus']
}