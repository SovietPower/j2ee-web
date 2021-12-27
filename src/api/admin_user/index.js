import axios from 'axios'

// 获取所有用户
const getUser = () =>
	axios.get('/api/v2/user').then(res => res.data)

// 设置用户状态
const setUserStatus = (id, status) =>
	axios.post('/api/v2/user/status', {
		id, status,
	}).then(res => res.data)



export {
	getUser, setUserStatus,
}
