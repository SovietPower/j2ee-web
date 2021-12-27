import { ElMessage } from 'element-plus'

const loginExpired = function(msg) {
	this.$router.push({
		name: 'Login'
	})
	ElMessage.error({
		title: '登录已过期，请重新登录',
		message: msg
	})
}
const deepCopy = function(item) {
	return JSON.parse(JSON.stringify(item))
}

export default {
	install(app) {
		app.config.globalProperties.loginExpired = loginExpired
		app.config.globalProperties.deepCopy = deepCopy
	}
}


// exports.install = function(Vue) {
// 	Vue.prototype.$target = 'http://localhost:8080/' // 本地后端地址

// 	// 封装登录超时的操作
// 	Vue.prototype.loginExpired = function(msg) {
// 		ElMessage.error({
// 			title: '登录已过期，需重新登录',
// 			message: msg
// 		})
// 		this.$router.push({
// 			name: 'Login'
// 		})
// 	}
// }
