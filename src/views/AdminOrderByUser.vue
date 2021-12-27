<template>
	<div class="order">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<AdminSidebar></AdminSidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>用户&ensp;{{userInfo.Username}}&ensp;的订单</p>
						</div>

						<div class="content-body">
							<el-tabs v-model="activeTab">
								<el-tab-pane
									v-for="(label, index) in ['所有订单', '未处理订单', '紧急订单']"
									:key="index"
									:name="index+''"
								>
									<template #label>
										<span @click="clickOn(index)">
											{{label}}
										</span>
									</template>

									<!-- 订单列表 -->
									<div v-if="orders.length>0">
										<div
											v-for="(order,index) in orders" :key="index"
											class="order-list"
										>
											<div class="order-list-header" :class="order.status==0?'header-finished':'header-unfinished'">
												<div class="header-title header-title-unfinished" v-if="order.allocate==0">待分配</div>
												<div class="header-title header-title-unfinished" v-else-if="order.status!=0">等待用户收货</div>
												<div class="header-title header-title-finished" v-else-if="order.rating==0">等待用户评价</div>
												<div class="header-title header-title-finished" v-else>已完成</div>
												<div class="header-info">
													<span class="info">{{$filters.dateFormat(order.created_at)}}</span>
													<span class="cut">|</span>
													<span class="info">订单号：{{order.order_id}}</span>
													<span class="cut">|</span>
													<span class="info" v-if="order.allocate==0" style="color:red;">暂未分配车辆</span>
													<span class="info" v-else>分配车辆：{{order.allocate}}</span>
												</div>
											</div>
											<div class="order-list-content" :class="order.status==0?'content-finished':'content-unfinished'">
												<div class="content-info">
													<p>
														货物种类：{{order.type}}
														<span v-if="order.urgent" style="color:red;">&emsp;紧急</span>
													</p>
													<p>
														发件人信息：{{order.s_name}}&emsp;{{order.s_phone}}&emsp;{{order.s_address}}
													</p>
													<p>
														收件人信息：{{order.r_name}}&emsp;{{order.r_phone}}&emsp;{{order.r_address}}
													</p>
													<p>
														订单评分<span v-if="order.rating==0" style="font-size: 14px;">（暂未评分）</span>：
														<el-rate
															style="display: inline"
															v-model="order.rating"
															:colors="['#99A9BF', '#F7BA2A', '#FF9900']"
															show-text
															:texts="['很差', '较差', '一般', '满意', '完美']"
															disabled>
														</el-rate>
													</p>
												</div>
												<div class="operate">
													<router-link :to="{ name: 'AdminOrderDetail', query: {order_id: order.order_id} }">
														<el-button class="button">查看订单详情</el-button>
													</router-link>
												</div>
											</div>
										</div>
									</div>
									<div v-else class="empty">
										<p>现在还没有订单哦</p>
									</div>
									<!-- 订单列表END -->

									<div class="pagination">
										<el-pagination
											background
											layout="total, prev, pager, next, jumper"
											:page-size="limit"
											:total="total"
											@current-change="handlePageChange"
										>
										</el-pagination>
									</div>
								</el-tab-pane>
							</el-tabs>
						</div>
					</div>

					<!-- content外的内容 -->

				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar'
import * as AdminOrderAPI from '@/api/admin_order'
import * as UserAPI from '@/api/user'
import { ElMessage } from 'element-plus'

export default {
	name: 'AdminOrderByUser',
	data() {
		return{
			user_id: 0,
			userInfo: 0,
			// 查询
			orders: [],
			total: 0,
			type: -1, // 查询方式：0：所有，1：未分配，2：紧急（但未完成）订单
			limit: 5, // 单次查询数量
			offset: 0, // 查询开始标号
			// 页面展示
			activeTab: '0', // 当前激活的标签页，注意是String
		}
	},
	activated() {
		if (this.$route.query.user_id != undefined) {
			this.user_id = this.$route.query.user_id
		}
		if (this.$route.query.type != undefined) {
			this.type = this.$route.query.type
		} else {
			this.type = 0
		}
		this.activeTab = this.type+''
	},
	watch: {
		user_id: function() {
			this.getOrder()
			this.getUserInfo()
		}
	},
	methods: {
		clickOn(index) {
			this.$router.push({
				path: '/admin/order/user',
				query: {
					type: index,
					user_id: this.user_id
				},
			})
		},
		getOrder() {
			AdminOrderAPI
				.getOrderByUser(this.user_id, this.limit, this.offset, this.type)
				.then(res => {
					if (res.status === 200) {
						if (res.data != null) {
							this.orders = res.data.data
							this.total = res.data.total
						}
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取订单失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取订单失败：'+err)
				})
		},
		getUserInfo() {
			UserAPI
				.getUserInfo(this.user_id)
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
		},
		handlePageChange(value) {
			// 参数为当前页数
			this.offset = this.limit * (value - 1)
			this.getOrder()
		}
	},
	components: {
		AdminSidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>
/* 订单头部 */
.order-list-header {
	height: 90px;
	margin: 0 auto;
	margin-top: 20px;
}
.header-finished {
	background-color: #d6fbff73;
	border-left: 1px solid #00e6ff;
	border-right: 1px solid #00e6ff;
	border-top: 1px solid #00e6ff;
	border-bottom: 1px solid #c3f9ff;
}
.header-unfinished {
	background-color: #fffaf7;
	border-left: 1px solid #ff6700;
	border-right: 1px solid #ff6700;
	border-top: 1px solid #ff6700;
	border-bottom: 1px solid #feccac;
}
.content-finished {
	border-left: 1px solid #00e6ff;
	border-right: 1px solid #00e6ff;
	border-bottom: 1px solid #00e6ff;
}
.content-unfinished {
	border-left: 1px solid #ff6700;
	border-right: 1px solid #ff6700;
	border-bottom: 1px solid #ff6700;
}
.header-title {
	font-size: 19px;
	margin-left: 24px;
	margin-top: 20px;
	margin-bottom: 10px;
}
.header-title-unfinished {
	color: #ff6700;
}
.header-title-finished {
	color: #00a724;
}
.order-list-header .header-info {
	width: 860px;
	margin: 0 auto;
	margin-top: 5px;
	align-items: center;
}
.order-list-header .header-info .info {
	font-size: 17px;
	color: #757575;
}
.order-list-header .header-info .cut {
	font-size: 17px;
	color: #c9c7c7;
	margin-left: 10px;
	margin-right: 10px;
	font-weight: 300;
}
/* 订单头部END */

/* 订单内容 */
.order-list-content {
	/* height: 117px; */
	background-color: #ffffff;
	margin: 0 auto;
	display: flex;
	align-items: center;
}
.order-list-content .content-info {
	margin-bottom: 12px;
}
.order-list-content .content-info p{
	padding: 12px 0 0 25px;
	width: 750px;
	font-size: 16px;
	color: #333333;
}
.order-list-content .operate {
	line-height: 50px;
	margin-left: -10px;
}
.order-list-content .button {
	color: #ffffff;
	background-color: #ff6700;
}
/* 订单内容END */

.order .pagination {
	width: 300px;
	margin: 0 auto;
	margin-top: 20px;
}
.empty {
	width: 200px;
	margin: 0 auto;
	padding-top: 50px;
	padding-bottom: 60px;
	color: #bdbaba;
	font-size: 18px;
}

</style>