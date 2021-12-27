import { createStore } from 'vuex'

import user from './modules/user'
import shoppingCart from './modules/shoppingCart'

export default createStore({
	strict: true,
	state: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		user,
		shoppingCart
	}
})

// import App from './App.vue'
// const app = createApp(App)
// app.use(Vuex)
