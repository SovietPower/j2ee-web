// 调用后端接口
// 修改完后记得export！
import axios from 'axios'

// 注册
const postRegister = form =>
	axios.post('/api/v1/register', form).then(res => res.data)
	// axios.post('http://localhost:8080/api/v1/register', form).then(res => res.data)
// 登录
const postLogin = form =>
	axios.post('/api/v1/login', form).then(res => res.data)

// 获取验证码
const getCaptcha = () =>
	// axios.get('/api/v0/get_captcha')
	axios.get('/api/v0/get_captcha').then(res => res.data) // 同样需要转为data

// 检验token
const checkToken = () => axios.get('/api/v1/check_token').then(res => res.data)

// 获取信息
const getUserInfo = user_id =>
	axios.get('/api/v1/info', {
		params: {user_id, }
	}).then(res => res.data)

export {
	postRegister, postLogin,
	getCaptcha,
	checkToken,
	getUserInfo
}
