<template>
	<div id="app" name="app">
		<el-container>
			<!-- 顶部导航栏 -->
			<div class="top-bar" v-show="$route.meta.showMenu!==false">
				<div class="nav">
					<ul>
						<li v-if="!user">
							<div style="margin-top:5px;font-size:16px">
								<router-link to="/login">登录</router-link>
							</div>
						</li>
						<li v-else class="header-user-con">
							<!-- todo 用户头像 -->
							<!-- 可使用el-avatar -->
							<!-- <div class="user-avatar">
								<img :src="user.avatar" />
							</div> -->
							<!-- 用户名下拉菜单 -->
							<div class="user-name">
								<el-dropdown>
									<span class="el-dropdown-link">
										{{user.username}}
										<el-icon><caret-bottom /></el-icon>
										<!-- <i class="el-icon-caret-bottom"></i> -->
									</span>
									<template #dropdown>
									<el-dropdown-menu>
										<router-link :to="{ path: adminPrefix+'/center' }">
											<el-dropdown-item>个人中心</el-dropdown-item>
										</router-link>
										<a href="https://www.zybuluo.com/SovietPower/note/1916979" target="_blank">
											<el-dropdown-item>关于</el-dropdown-item>
										</a>
										<a @click="logout()">
											<el-dropdown-item>退出登录</el-dropdown-item>
										</a>
									</el-dropdown-menu>
									</template>
								</el-dropdown>
							</div>
						</li>
						<li class="font">
							<router-link :to="{ path: adminPrefix+'/order' }">我的订单</router-link>
						</li>
						<li class="font">
							<router-link to="/message">消息通知
							<el-badge class="mark" v-show="userInfo.MsgNumber>0" :value="userInfo.MsgNumber" :max="9" style="margin: 0 -7px 0 3px; transform: scale(0.9);" />
							</router-link>
						</li>

						<li class="shopCart" :class="orderUnhandled>0 ? 'shopCart-full' : 'shopCart-empty'">
							<div style="margin-top:5px">
								<router-link :to="{ path: adminPrefix+'/order', query: {type:1} }">
									<el-icon>
										<shopping-cart-full v-if="orderUnhandled>0" />
										<shopping-cart v-else />
									</el-icon>
									未完成订单
									<span>{{orderUnhandled}}</span>
								</router-link>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!-- 顶部导航栏END -->

			<!-- 顶栏容器 -->
			<!-- deleted -->
			<!-- 顶栏容器END -->

			<!-- 主要区域容器 -->
			<el-main>
				<router-view :key="key" v-slot="{ Component }">
					<keep-alive>
						<component :is="Component" />
					</keep-alive>
				</router-view>
			</el-main>
			<!-- 主要区域容器END -->

			<!-- 底栏容器 -->
			<el-footer v-show="$route.meta.showMenu!==false">
				<div class="footer">
					<div class="github">
						<a href="https://github.com/" target="_blank">
							<div class="github-but"></div>
						</a>
					</div>
					<div class="copyright">
						<p>
							<router-link to="/">首页</router-link>
							<span>|</span>
							<router-link to="/order">全部订单</router-link>
							<span>|</span>
							<router-link to="/about">关于我们</router-link>
						</p>
						<p>
							Copyright ©2021, J2EE 作业 圣诞快乐
							<!-- <iframe
								style="margin-left: 2px; margin-bottom:-5px;"
								frameborder="0"
								scrolling="0"
								width="91px"
								height="20px"
								src=""
							></iframe> -->
						</p>
						<a href="https://beian.miit.gov.cn/" target="_blank">某ICP备20221234号</a>
					</div>
				</div>
			</el-footer>
			<!-- 底栏容器END -->
		</el-container>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import * as userAPI from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
	// beforeUpdate() {
	// 	this.activeIndex = this.$route.path // 用于顶栏容器
	// },
	data() {
		return {
			user: 0,
			userInfo: 0,
			orderUnhandled: 0,
			adminPrefix: '',
		}
	},
	beforeCreate() {
		document.querySelector('body').setAttribute('style', 'background:#f5f5f5')
	},
	created() {
		// 获取浏览器localStorage，判断用户是否已经登录
		userAPI.checkToken(localStorage.getItem('token')).then(res => {
			// 如果已经登录，设置vuex登录状态
			if (res.status == 200) {
				this.setUser(JSON.parse(localStorage.getItem('user')))
			} else {
				localStorage.removeItem('user')
				localStorage.removeItem('token')
			}
		})
	},
	computed: {
		...mapGetters(['getUser']),
		key() {
			return this.$route.path + Math.random()
		}
	},
	watch: {
		// 获取vuex的登录状态
		getUser: function(val) {
			if (val === '') {
				// 用户没有登录
				// this.setShoppingCart([])
			} else {
				this.user = this.$store.getters.getUser

				// 用户已经登录,获取该用户的部分信息
				userAPI
					.getUserInfo(this.user.id)
					.then(res => {
						if (res.status === 200) {
							if (res.data != undefined) {
								this.userInfo = res.data
								if (this.user.authority==0) {
									this.orderUnhandled = this.userInfo.OrderUnhandled
									this.adminPrefix = '/admin'
								}
								else {
									this.orderUnhandled = this.userInfo.SendNumber+this.userInfo.ReceiveNumber
								}
							}
						} else if (res.status === 20001) {
							this.loginExpired(res.msg)
						} else {
							ElMessage.error('获取用户信息失败：'+res.msg)
						}
					})
					.catch(err => {
						ElMessage.error('获取用户信息失败：'+err)
					})
			}
		}
	},
	methods: {
		...mapActions(['setUser', 'setShoppingCart']),
		//重定向
		login() {
			this.$router.push({
				name: 'Login'
			})
		},
		register() {
			this.$router.push({
				name: 'Login'
			})
		},
		// 退出登录
		logout() {
			// 清空本地登录信息
			localStorage.removeItem('user')
			localStorage.removeItem('token')
			// 清空vuex登录信息
			this.setUser('')
			this.$router.push({
				name: 'Login'
			})
			ElMessage({
				message: '退出成功',
				type: 'success',
			})
		},
		// 点击搜索按钮
		searchClick() {
			if (this.search != '') {
				// 跳转到全部商品页面,并传递搜索条件
				this.$router.push({ path: '/goods', query: { search: this.search } })
				this.search = ''
			}
		}
	}
}
</script>

<style>
/* 全局CSS */
* {
	padding: 0;
	margin: 0;
	border: 0;
	list-style: none;
}

.header-user-con {
	display: flex;
	height: 50px;
	align-items: center;
}
.user-name {
	margin-left: 10px;
}
.user-avatar img {
	display: block;
	width: 40px;
	height: 40px;
	border-radius: 50%;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
}

.el-dropdown-menu__item {
	text-align: center;
}
.el-dropdown-item:hover {
	color: #ff6700;
}

#app .el-header {
	padding: 0;
}
#app .el-main {
	min-height: 300px;
	padding: 0;
}
#app .el-footer {
	padding: 0;
}
a,
a:hover {
	text-decoration: none;
}
/* 全局CSS END */

/* 顶部导航栏CSS */
.top-bar {
	height: 50px;
	background-color: #303643;
}
.top-bar .nav {
	width: 1225px;
	margin: 0 auto;
}
.top-bar .nav ul {
	float: right;
}
.top-bar .nav li {
	float: left;
	height: 50px;
	color: #b0b0b0;
	font-size: 16px;
	text-align: center;
	line-height: 40px;
	margin-left: 20px;
}
.top-bar .nav li.font {
	margin-top: 5px;
}

.top-bar .nav li .router-link {
	margin-top: 5px;
}

.top-bar .nav li .el-button {
	color: #b0b0b0;
}
.top-bar .nav .el-button:hover {
	color: #fff;
}
.top-bar .nav li a {
	color: #b0b0b0;
}
.top-bar .nav a:hover {
	color: #fff;
}
.top-bar .nav .shopCart {
	padding-right: 5px;
	width: 120px;
}
.top-bar .nav .shopCart:hover {
	background: #fff;
}
.top-bar .nav .shopCart:hover a {
	color: #ff6700;
}
.top-bar .nav .shopCart-full {
	background: #ff6700;
}
.top-bar .nav .shopCart-full a {
	color: white;
}
.top-bar .nav .shopCart-empty {
	background: #424242;
}

/* 顶部导航栏CSS END */

/* 顶栏容器CSS */
.el-header {
	margin-bottom: 20px;
	background-color: #ffffff;
}
.el-header .el-menu {
	max-width: 1225px;
	margin: 0 auto;
	display: flex;
	align-items: center;
}

.el-header .logo {
	height: 60px;
	width: 100px;
	float: left;
	margin-right: 30px;
}
.el-header .logo img {
	height: 60px;
}
.el-header .so {
	width: 300px;
	margin-left: 437px;
}
/* 顶栏容器CSS END */

/* 底栏容器CSS */
.footer {
	width: 100%;
	text-align: center;
	background: #2f2f2f;
	padding-bottom: 20px;
}
.footer .ng-promise-box {
	border-bottom: 1px solid #3d3d3d;
	line-height: 145px;
}
.footer .ng-promise-box {
	margin: 0 auto;
	border-bottom: 1px solid #3d3d3d;
	line-height: 145px;
}
.footer .ng-promise-box .ng-promise p a {
	color: #fff;
	font-size: 20px;
	margin-right: 210px;
	padding-left: 44px;
	height: 40px;
	display: inline-block;
	line-height: 40px;
	text-decoration: none;
	background: url('./assets/imgs/us-icon.png') no-repeat left 0;
}
.footer .github {
	height: 50px;
	line-height: 50px;
	margin-top: 20px;
}
.footer .github .github-but {
	width: 50px;
	height: 50px;
	margin: 0 auto;
	background: url('./assets/imgs/github.png') no-repeat;
}
.footer .copyright {
	text-align: center;
	color: #888888;
}
.footer .copyright p {
	margin: 20px 0 16px 0;
}

.footer .copyright p a {
	color: #888888;
	text-decoration: none;
}
.footer .copyright p a:hover {
	color: #fff;
}
.footer .copyright p span {
	padding: 0 22px;
}
.footer .copyright a {
	color: #888888;
}
/* 底栏容器CSS END */
</style>