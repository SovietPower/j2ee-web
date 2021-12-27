import axios from 'axios'

// 获取信息
const getAdminInfo = user_id =>
	axios.get('/api/v2/info', {
		params: {user_id, }
	}).then(res => res.data)

export {
	getAdminInfo,
}
