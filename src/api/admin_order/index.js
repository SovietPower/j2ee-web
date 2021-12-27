import axios from 'axios'

// 获取一部分订单
const getOrder = (limit, offset, type) =>
	axios.get('/api/v2/order', {
		params: {
			user_id: 0, limit, offset, type,
		}
	}).then(res => res.data)

// 获取某用户的一部分订单
const getOrderByUser = (user_id, limit, offset, type) =>
	axios.get('/api/v2/order', {
		params: {
			user_id, limit, offset, type,
		}
	}).then(res => res.data)

// 获取订单详情
const showOrder = id =>
	axios.get(`/api/v2/order/${id}`).then(res => res.data)


export {
	getOrder, getOrderByUser, showOrder,
}
