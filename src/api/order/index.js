import axios from 'axios'

// 创建订单
const createOrder = (user_id, sender, receiver, form) =>
	axios.post('/api/v1/order', {
		user_id: user_id,
		// 发件人与收件人
		s_name: sender.name,
		s_phone: sender.phone,
		s_address: sender.address,
		r_name: receiver.name,
		r_phone: receiver.phone,
		r_address: receiver.address,
		// 货物信息
		type: form.type,
		weight: form.weight,
		volume: form.volume,
		value: form.value,
		urgent: form.urgent,
		note: form.note,
	}).then(res => res.data)

// 获取指定的一部分订单
const getOrder = (user_id, username, limit, offset, type) =>
	axios.get('/api/v1/order', {
		params: {
			user_id, username, limit, offset, type,
			// user_id: user_id,
			// username: real_name,
			// limit: limit,
			// offset: offset,
			// type: type,
		}
	}).then(res => res.data)

// 获取订单详情。参数是订单编号order_id（不向用户展示数据库id）
const showOrder = (id, user_id, username) =>
	// 用``而不是''（字符串）将id传进去
	axios.get(`/api/v1/order/${id}`, {
		params:{ user_id, username, }
	}).then(res => res.data)

// 评价订单
const rateOrder = (id, rating) =>
	axios.post('/api/v1/order_rate', {
		id: id,
		rating: rating,
	}).then(res => res.data)

export {
	createOrder, getOrder, showOrder, rateOrder,
}
