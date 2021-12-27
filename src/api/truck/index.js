import axios from 'axios'

// 获取货车信息
const getTruck = () =>
	axios.get('/api/v2/truck',{
		params: {type: 0, }
	}).then(res => res.data)

// 仅获取货车数量
const getTruckNum = () =>
	axios.get('/api/v2/truck',{
		params: {type: 1, }
	}).then(res => res.data)

// 用户可调用的获取货车信息。仅获取货车数量
const getTruckByUser = () =>
	axios.get('/api/v1/truck').then(res => res.data)

// 分配货车
const allocateTruck = (id, order_id) =>
	axios.post('/api/v2/truck/allocate', {
		id, order_id,
	}).then(res => res.data)

// 添加货车（可能后续需要更多参数）
const createTruck = () =>
	axios.post('/api/v2/truck/create').then(res => res.data)

export {
	getTruck, getTruckNum,
	getTruckByUser,
	allocateTruck,
	createTruck,
}
