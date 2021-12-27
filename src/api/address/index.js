import axios from 'axios'

// 创建地址
const createAddress = form =>
	axios.post('/api/v1/address', form).then(res => res.data)

// 获取地址
const getAddress = user_id =>
	axios.get(`/api/v1/address/${user_id}`).then(res => res.data)

// 更新地址
const updateAddress = form =>
	axios.put('/api/v1/address', form).then(res => res.data)

// 更新地址是否置顶
const updateAddressPin = (ID, user_id, pinned) =>
	// 注意和delete方法的请求参数不一样，不需要包在data内。
	axios.put('/api/v1/address_pin', {
		id: ID,
		user_id: user_id,
		pinned: pinned
	}).then(res => res.data)

// 删除地址
const deleteAddress = addressID =>
	axios.delete('/api/v1/address', {
		data: { address_id: addressID }
	}).then(res => res.data)

export {
	createAddress,
	getAddress,
	updateAddress,
	updateAddressPin,
	deleteAddress,
}
