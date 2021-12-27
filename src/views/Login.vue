<template>
<div class="container">
	<div class="box">
		<div class="login">
			<div class="login-box">
				<div class="apple-btn login-apple">
					<li class="red-btn"></li>
					<li class="yellow-btn"></li>
					<li class="green-btn"></li>
				</div>
				<div class="title">Login</div>

				<el-form :model="form" :rules="rules" status-icon ref="form">
					<div class="input">
						<el-form-item prop="username">
							<el-input v-model="form.username" type="text" placeholder="Input your username"/>
						</el-form-item>
					</div>
					<div class="input">
						<el-form-item prop="password">
							<el-input v-model="form.password" type="password" placeholder="Input your password" show-password />
						</el-form-item>
					</div>
					<div class="input captcha">
						<el-form-item prop="captcha">
							<el-input v-model="form.captcha" placeholder="Input the captcha"/>
						</el-form-item>
					</div>
				</el-form>
				<div class="captchaPic">
					<img :src="form.captchaURL" alt="验证码加载失败，请刷新"
						style="height:72px; width:216px; border: solid 1px #ffffff;"
						@click="getCaptcha()"
					/>
				</div>

				<div class="btn login-btn" @click="login()">
					<span>登录</span>
				</div>
				<div class="change-box login-change">
					<div class="change-btn toSign">
						<span>注册账号</span>
					</div>
				</div>
			</div>

			<div class="sign-box">
				<div class="apple-btn sign-apple">
					<li class="red-btn"></li>
					<li class="yellow-btn"></li>
					<li class="green-btn"></li>
				</div>
				<div class="title">Sign up</div>

				<el-form :model="form" :rules="rules" status-icon ref="form">
					<div class="input">
						<el-form-item prop="username">
							<el-input v-model="form.username" type="text" placeholder="Input your username"/>
						</el-form-item>
					</div>
					<div class="input">
						<el-form-item prop="password">
							<el-input v-model="form.password" type="password" placeholder="Input your password" show-password />
						</el-form-item>
					</div>
					<div class="input captcha">
						<el-form-item prop="captcha">
							<el-input v-model="form.captcha" placeholder="Input the captcha"/>
						</el-form-item>
					</div>
				</el-form>
				<div class="captchaPic">
					<img :src="form.captchaURL" alt="验证码加载失败，请刷新"
						style="height:72px; width:216px; border: solid 1px #000000;"
						@click="getCaptcha()"
					/>
				</div>

				<div class="btn sign-btn" @click="register()">
					<span>注册</span>
				</div>
				<div class="change-box sign-change">
					<div class="change-btn toLogin">
						<span>登录</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import * as api_user from '@/api/user'
import { mapActions } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
	name: 'Login',
	data() {
		var validateUsername = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入用户名'))
			}
			else if (/^[a-zA-Z0-9]+$/.test(value) == false) {
				callback(new Error('请输入字母或数字'))
			}
			else if (value.length < 3 || value.length > 12) {
				callback(new Error('用户名长度需在3到12个字符之间'))
			}
			callback()
		}
		var validatePassword = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'))
			}
			else if (/^[a-zA-Z0-9]+$/.test(value) == false) {
				callback(new Error('请输入字母或数字'))
			}
			// else if (value.length < 6 || value.length > 16) {
			// 	callback(new Error('密码长度需在6到16位之间'))
			// }
			callback()
		}
		var validateCaptcha = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入验证码'))
			}
			else if (/^[a-zA-Z0-9]+$/.test(value) == false) {
				callback(new Error('请输入字母或数字，不区分大小写'))
			}
			// 不再验证验证码长度
			// else if (value.length != 5) {
			// 	callback(new Error('验证码长度需为5位'))
			// }
			callback()
		}
		return {
			form: {
				username: '',
				password: '',
				captcha: '',
				captchaID: '', // 后端返回的captchaID，需用于验证码校验
				captchaURL: '' // 后端返回的验证码URL，用这个是可扩展到PNG外的格式
			},
			rules: {
				username: [{ validator: validateUsername, trigger: 'change'}],
				password: [{ validator: validatePassword, trigger: 'blur'}],
				captcha: [{ validator: validateCaptcha, trigger: 'blur'}]
			}
		}
	},
	methods: {
		...mapActions([
			'setUser'
		]),
		operationFail(msg, title) {
			ElMessageBox.alert(msg, title, {
				confirmButtonText: 'OK',
				callback: (action) => {
					this.form.password = ''
					this.form.captcha = ''
				}
			})
			// 重新获取验证码（一次后失效）
			this.getCaptcha()
		},
		login() {
			// this 是当前应用
			this.$refs.form.validate(valid => {
				if (!valid) {
					this.operationFail('请正确填写信息', '操作失败')
					return // el-form表单验证（重新调用rules验证）
				}

				api_user.postLogin(this.form)
					.then(res => {
						if (res.status === 200) {
							if (res.data.user.status == 2) {
								ElMessage.error('您的账号已被封禁，请联系管理员')
								return
							}

							// 保存登录信息到本地
							localStorage.setItem('user', JSON.stringify(res.data.user))
							localStorage.setItem('token', res.data.token)

							// 保存登录信息到vuex
							this.setUser(res.data.user)

							this.$router.push({
								name: res.data.user.authority==0?'AdminCenter':'Center'
							})
							// 通知框提示登录成功信息
							ElMessage({
								showClose: true, // 关闭按钮
								message: '登录成功',
								type: 'success'
							})
						}
						else {
							this.operationFail(res.msg, '登录失败')
							// ElMessage.error('登录失败：'+res.msg) // 只能用一个字符串参数，不能多个
						}
					})
					.catch(error => {
						this.operationFail(res.msg, '登录失败')
					})
			})
		},
		register() {
			this.$refs.form.validate(valid => {
				if(!valid) {
					this.operationFail('请正确填写信息', '操作失败')
					return // el-form表单验证（重新调用rules验证）
				}

				api_user.postRegister(this.form)
					.then(res => {
						if (res.status === 200) {
							// 通知框提示成功信息
							ElMessage({
								showClose: true, // 关闭按钮
								message: '注册成功',
								type: 'success',
							})
							setTimeout(()=>{
								location.reload();
							}, 500);
						}
						else {
							this.operationFail(res.msg, '注册失败')
						}
					})
					.catch(error => {
						this.operationFail(res.msg, '注册失败')
					})
			})
		},
		getCaptcha() {
			api_user.getCaptcha()
				.then(res => {
					this.form.captchaID = res.captchaID
					this.form.captchaURL = res.captchaURL
				})
				.catch(error => {
					ElMessage.error('验证码获取失败：'+error)
				})
		}
	},
	mounted() {
		// 如果进入后不刷新，div box显示不出来，所以刷新一次
		if (location.href.indexOf("#reloaded") == -1) {
			location.href = location.href + "#reloaded";
			location.reload();
		}
		else {
			// ...
			this.getCaptcha()
		}
		// this.$router.go(0);
	}
}

// 封装选择器
const getSelector = ele => {
    return typeof ele == "string" ? document.querySelector(ele) : "";
}
// 登录注册载入
const boxShow = () => {
    var show = getSelector(".box")
    show.className += " box-show"
}

// jQuery
// $(document).ready(function(){

// })

window.onload = function() {
	boxShow();
	// 登录注册页切换
	((window, document) => {
		// 登录 -> 注册
		let toSignBtn = getSelector(".toSign"),
			toLoginBtn = getSelector(".toLogin"),
			loginBox = getSelector(".login-box"),
			signBox = getSelector(".sign-box");
		toSignBtn.onclick = () => {
			loginBox.className += ' animate_login';
			signBox.className += ' animate_sign';
		}
		toLoginBtn.onclick = () => {
			loginBox.classList.remove("animate_login");
			signBox.classList.remove("animate_sign");
		}
	})(window, document);
}
</script>

<style scoped src="../style/login.css"></style>
<style scoped>
/* @import "../style/login.css"; */


</style>