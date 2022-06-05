const path = require('path');
const { name } = require('./package');


function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 9004; // mobile port
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
        ? '/sub-app-mobile/'
        : '/',
  lintOnSave: false,
  productionSourceMap: false,  // 生产环境的 source map
  devServer: {
    port,
    proxy: {
      '/(pkc|execute|gateway|flow|es|sso|permission|file-storage)/': {
        target: 'http://172.17.43.35:8989/',
        ws: false,
        changeOrigin: true,
      },
      '/cas/': {
        target: 'http://172.17.43.35:8989/',
        ws: false,
        changeOrigin: true,
      },
      '/group1/M00': {
        target: 'http://172.17.43.35:8989/',
        ws: false,
        changeOrigin: true,
      },
      '/authPlatform': {
        target: 'http://ak-sp.com:88',
        ws: false,
        pathRewrite: { '^/authPlatform': '' },
        changeOrigin: true
    }
    },
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true, //添加 重点
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
          'vue$': 'vue/dist/vue.esm.js',
          'mergely':		path.join(__dirname, 'node_modules', 'mergely'),
          'CodeMirror':	path.join(__dirname, 'node_modules', 'codemirror'),
          'jQuery':		path.join(__dirname, 'node_modules', 'jquery'),
          '$':			path.join(__dirname, 'node_modules', 'jquery')
      }
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.plugins.delete('prefetch');
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
      config.module
      .rule('fonts')
      .test(/\.(woff|woff2|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 1000000000,
        name: '[name].[hash:7].[ext]',			//文件名
        //publicPath:'../fonts/',					//打包时替换的路径
        //outputPath:path.posix.join('portal', '/fonts')	//文件输出路径
      })
      .end();
  },
};
