<template>
	<div class="center" id="center" name="center">
		<div class="center-layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<Sidebar></Sidebar>
				</div>
				<el-col :span="20">
					<div class="center-content">
						<!-- 个人信息头部 -->
						<div class="center-user">
							<!-- <div class="user-avatar">
								<img :src="this.$store.getters.getUser.avatar" />
							</div> -->
							<div class="user-info">
								<p
									style="font-size:35px; margin-bottom: 15px; font-weight:400; color:#464547"
								>{{this.$store.getters.getUser.username}}</p>
								<p>
									<router-link to="/info" style="font-size:15px; color:#ff6700;">修改个人信息 ></router-link>
								</p>
								<p>
									<router-link to="/submit" style="font-size:15px; color:#ff6700;">新建订单 ></router-link>
								</p>
							</div>
							<div class="user-message">
								<ul>
									<li>账户等级：</li>
									<li>共发送订单数：</li>
									<li>共接收订单数：</li>
								</ul>
							</div>
							<div class="user-data">
								<ul>
									<li>{{user.status == 0 ? '普通' : user.status == 1 ? '受限' : '封禁'}}</li>
									<li>{{userInfo.SendTotal}}</li>
									<li>{{userInfo.ReceiveTotal}}</li>
								</ul>
							</div>
						</div>
						<!-- 个人信息头部END -->
						<div class="user-details">
							<svg class="icon" width="100" height="100" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-365b8594=""><path fill="currentColor" d="M174.72 855.68l135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0189.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 01-206.912-48.384l-175.616 58.56z"></path><path fill="currentColor" d="M512 563.2a51.2 51.2 0 110-102.4 51.2 51.2 0 010 102.4zm192 0a51.2 51.2 0 110-102.4 51.2 51.2 0 010 102.4zm-384 0a51.2 51.2 0 110-102.4 51.2 51.2 0 010 102.4z"></path></svg>
							<div class="operation">
								<p class="operation-title">未读消息：{{userInfo.MsgNumber}}</p>
								<p>
									<router-link :to="{ path: '/message' }" class="href">查看未读消息 ></router-link>
								</p>
							</div>

							<div class="operation-img">
								<img src="../assets/imgs/transporting.png" />
							</div>
							<div class="operation">
								<p class="operation-title">已发出订单：{{userInfo.SendNumber}}</p>
								<p>
									<router-link :to="{ path: '/order', query:{type: 1} }" class="href">查看已发出订单 ></router-link>
								</p>
							</div>
						</div>
						<div class="user-details1">
							<div class>
								<img src="../assets/imgs/order.png" />
							</div>
							<div class="operation">
								<p class="operation-title">所有订单：{{userInfo.OrderTotal}}</p>
								<p>
									<router-link :to="{ path: '/order'}" class="href">查看所有订单 ></router-link>
								</p>
							</div>

							<div class="operation-img">
								<img src="../assets/imgs/transporting2.png" />
							</div>
							<div class="operation">
								<p class="operation-title">待收货订单：{{userInfo.ReceiveNumber}}</p>
								<p>
									<router-link :to="{ path: '/order', query:{type: 2} }" class="href">查看待收货订单 ></router-link>
								</p>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import * as UserAPI from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
	name: 'Center',
	data() {
		return {
			user: 0,
			userInfo: 0,
		}
	},
	created() {
		this.user = this.$store.getters.getUser
		this.getUserInfo()
	},
	methods: {
		getUserInfo() {
			UserAPI
				.getUserInfo(this.user.id)
				.then(res => {
					if (res.status === 200) {
						if (res.data != undefined) {
							this.userInfo = res.data
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
	},
	components: {
		Sidebar
	}
}
</script>

<style scoped>
.center-layout {
	max-width: 1225px;
	margin: 0 auto;
}
.center-content {
	padding: 0 100px;
	background-color: #ffffff;
	margin-bottom: 30px;
}
.center-user {
	height: 280px;
	width: 800px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	padding: 0;
	border-bottom: 1px solid #c2c4ca;
}
.user-avatar img {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	padding: 5px;
	border: 1px solid #ddd;
}
.user-info {
	width: 260px;
	line-height: 30px;
	margin-left: 15px;
	padding: 0;
}
.user-message {
	/* float: right; */
	line-height: 30px;
	padding: 0;
}
.user-message ul li {
	color: #77787b;
	font-size: 17px;
}
.user-data {
	line-height: 30px;
	padding: 0;
}
.user-data ul li {
	color: #77787b;
	font-size: 17px;
}
.user-data ul li a {
	color: #77787b;
}
.user-data ul li a:hover {
	color: #ff6700;
}
.user-details {
	height: 150px;
	width: 800px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	margin-top: 50px;
}
.user-details1 {
	height: 150px;
	width: 800px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	padding-bottom: 50px;
}
.operation-img {
	margin-left: 200px;
}
.operation {
	line-height: 30px;
	margin-left: 20px;
}
.operation .operation-title {
	font-size: 20px;
	color: #7b7f86;
}
.operation .href {
	font-size: 15px;
	color: #7b7f86;
}
.operation .href:hover {
	color: #ff6700;
}

.email-pop-out {
	text-align: center;
}
</style>