import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

const app = createApp(App)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'

app.use(ElementPlus)

// 全局注册el-icon的组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

// 全局请求拦截器
axios.interceptors.request.use(
	config => {
		let token = window.localStorage.getItem('token')
		if (token) {
			//将token放到请求头发送给服务器,将token key放在请求头中
			config.headers.Authorization = token
			//也可以这种写法
			// config.headers['accessToken'] = Token;
		}
		return config
	},
	error => {
		// Do something with request error
		return Promise.reject(error)
	}
)

// 跳转页面时返回顶部
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0)
})

// 全局拦截器,在进入需要用户权限的页面前校验是否已经登录，或检验用户是否有管理员权限
import { ElMessage } from 'element-plus'

router.beforeResolve((to, from, next) => {
	const user = store.state.user.user
	// 判断路由是否设置相应校验用户权限
	if (to.meta.requireLogin) {
		if (!user) {
			// 没有登录，转到登录界面
			router.push({
				name: 'Login'
			})
			if (from.name == null) {
				//此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
				next('/')
				return
			}
			// 终止导航
			next(false)
			return
		}
	}
	if (to.meta.requireAuth) {
		if (!user) {
			// 没有登录，转到登录界面
			router.push({
				name: 'Login'
			})
			if (from.name == null) {
				//此时，是在页面没有加载，直接在地址栏输入链接，进入需要登录验证的页面
				next('/')
				return
			}
			// 终止导航
			next(false)
			return
		}
		if (user.authority != 0) {
			router.push({
				name: 'Center'
			})
			ElMessage.error('您没有访问权限')
			next(false) // 注意要终止
			return
		}
	}
	next()
})

app.use(store).use(router)


// 自定义全局方法（不同于Vue 2.x）
import Global from './Global'
app.use(Global)


// 自定义全局组件
// import MyMenu from './components/MyMenu'
// app.component(MyMenu.name, MyMenu)


// 相对时间过滤器，把时间戳转换成时间
// 格式: 2020-02-25 21:43:23
// 注：Vue 3.x已移除过滤器，可使用全局属性代替。
app.config.globalProperties.$filters = {
	dateFormat(tag) {
		if (tag / 10000000000 <= 1) {
			tag = tag * 1000
		}
		var date = new Date(tag) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-'
		var M =
			(date.getMonth() + 1 < 10
			? '0' + (date.getMonth() + 1)
			: date.getMonth() + 1) + '-'
		var D =
			(date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate()) + ' '
		var h =
			date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
		var m =
			date.getMinutes() < 10
			? '0' + date.getMinutes() + ':'
			: date.getMinutes() + ':'
		var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
		return Y + M + D + h + m + s
	}
}


app.mount('#app')