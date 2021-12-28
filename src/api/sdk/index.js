import axios from 'axios'

// 获取子级行政区
const getDistricts = keyword =>
	axios.get('/api/v3/amap/districts', {
		params: {
			keyword,
		}
	}).then(res => res.data)

export {
	getDistricts,
}
