export default {
	state: {
		user: '' // 当前登录的用户
	},
	getters: {
		getUser(state) {
			return state.user
		},
		// 会变的信息，不存储在本地
		// getUserMsgNum(state) {
		// 	return state.user.id // todo
		// }
	},
	mutations: {
		setUser(state, data) {
			state.user = data
		}
	},
	actions: {
		setUser({ commit }, data) {
			commit('setUser', data)
		}
	}
}
