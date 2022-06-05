module.exports = {
	productionSourceMap: false,  // 生产环境的 source map
	devServer: {
		port: 9001,
		proxy: {
		  '/(pkc|execute|gateway|flow|es|permission|sso|file-storage|debugPlatfrom)/': {
			target: 'http://172.16.86.14:8989/',
			ws: false,
			changeOrigin: true,
		  },
		  '/cas/': {
			target: 'http://172.16.86.14:8989/',
			ws: false,
			changeOrigin: true,
		  },
		  '/group1/M00': {
			target: 'http://172.16.86.14:8989/',
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
}