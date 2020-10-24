
module.exports = {
  /*vue中的运行环境*/
  publicPath: process.env.NODE_ENV === 'production' ? '/rebarproject/' : '/',
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '192.168.43.215',
    // host: '0.0.0.0',
    port: 8081,
    https: false,
    hotOnly: false,
  },

  configureWebpack:{
    resolve:{
      alias:{
        //已经有@ src 配置
        "assets": "@/assets",
        "common": "@/common",
        "components":"@/components",
        "views":"@/views",
        "network":"@/network",
        "store":"@/store",
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // path.resolve(__dirname, '../src/assets/css/themes.less')
      ]
    }
  },
}
