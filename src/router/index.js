import { createRouter, createWebHashHistory } from 'vue-router'

// import Home from '../views/Home.vue' // 更推荐用下面的形式，效率更高。此外更推荐在component处写箭头函数，这样只在需要时import。
// const Home = () => import('../views/Home.vue')
// const About = () => import(/* webpackChunkName: "about" */ '../views/About.vue')
// const NotFound = () => import('../views/NotFound.vue')

const routes = [
	{ path:'/', redirect:'/login'},
	{
		path: '/home', // 带'/'表示从根开始路由，不加'/'表示从当前位置开始路由（但`router-link`中要写全）。
		name: 'Home',
		component: () => import('../views/Home.vue'), // 该路径要渲染哪个组件。
		// 在一个组件中加入`<router-view/>`时，所有属于当前组件所在路由的子路由都会在此处渲染。
		children: [
			{
				path: '/about',
				name: 'About',
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
			}
		]
	},
	{
		path:'/login',
		name:'Login',
		component: () => import('../views/Login.vue'),
		meta: {
			showMenu: false
		}
	},
	{
		path: '/center',
		name: 'Center',
		component: () => import('../views/Center.vue'),
		meta: {
			requireLogin: true // 需要验证登录状态
		}
	},
	// {
	// 	path: '/message',
	// 	name: 'Message',
	// 	component: () => import('../views/Message.vue'),
	// 	meta: {
	// 		requireLogin: true
	// 	}
	// },
	{
		path: '/submit',
		name: 'Submit',
		component: () => import('../views/Submit.vue'),
		meta: {
			requireLogin: true
		}
	},
	{
		path: '/order',
		name: 'Order',
		component: () => import('../views/Order.vue'),
		meta: {
			requireLogin: true
		}
	},
	{
		path: '/detail',
		name: 'OrderDetail',
		component: () => import('../views/OrderDetail.vue'),
		meta: {
			requireLogin: true
		}
	},
	// {
	// 	path: '/info',
	// 	name: 'Info',
	// 	component: () => import('../views/Info.vue'),
	// 	meta: {
	// 		requireLogin: true
	// 	}
	// },
	{
		path: '/address',
		name: 'Address',
		component: () => import('../views/Address.vue'),
		meta: {
			requireLogin: true
		}
	},
	{
		path: '/admin/center',
		name: 'AdminCenter',
		component: () => import('../views/AdminCenter.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/order',
		name: 'AdminOrder',
		component: () => import('../views/AdminOrder.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/order/user',
		name: 'AdminOrderByUser',
		component: () => import('../views/AdminOrderByUser.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/detail',
		name: 'AdminOrderDetail',
		component: () => import('../views/AdminOrderDetail.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/user',
		name: 'AdminUser',
		component: () => import('../views/AdminUser.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/truck',
		name: 'AdminTruck',
		component: () => import('../views/AdminTruck.vue'),
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/admin/address',
		name: 'AdminAddress',
		component: () => import('../views/AdminAddress.vue'),
		meta: {
			requireAuth: true
		}
	},
	{ path:'/404', name:'404', component: () => import('../views/NotFound.vue')},
	{ path:'/:pathMatch(.*)', redirect:'/404'} // 或'/:pathMatch(.*)*'
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
