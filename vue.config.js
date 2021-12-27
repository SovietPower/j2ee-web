module.exports = {
	devServer: {
		// 以下两个配置不能出现在此处，会有 ValidationError: webpack Dev Server Invalid Options
		// 静态资源文件夹
		// assetsSubDirectory: 'static',
		// 发布路径
		// assetsPublicPath: '/',
		// proxy: null, // string | Object
		proxy: {
			// 设置后，从接口的requestUrl是看不出来的
			"/api": {
				target: "http://localhost:8080", // 会将api字符串替换为target

				// 是否跨域。会开启代理，在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
				changeOrigin: true,

				ws: true,

				pathRewrite: {
					'^/api': '/api' // 用target替换后应变成什么
					// '^/api': '/static/mock'
				}
			}
		},
		open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8000,
		https: false,
		hotOnly: false,
		before: app => {}
	}
}