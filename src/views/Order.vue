<template>
	<div class="order">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<Sidebar></Sidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>我的订单</p>
						</div>

						<div class="content-body">
							<el-tabs v-model="activeTab">
								<!-- 注意v-model和name都是String -->
								<el-tab-pane
									v-for="(label, index) in ['所有订单', '已发出订单', '待接收订单', '未评价订单']"
									:key="index"
									:name="index+''"
								>
									<!-- 因为每次切换tab都重新跳转、获取后端数据，所以无需为每个tab分别获取渲染内容 -->
									<!-- 返回的order格式，见后端serializer/order.go -->
									<template #label>
										<!-- <router-link :to="{ path: '/order', query: {type:index} }" -->
										<!-- 不用router-link，因为会影响格式 -->
										<!-- 注意要加click，需要span，不能直接在template上 -->
										<span @click="clickOn(index)">
											{{label}}
										</span>
									</template>

									<!-- 订单列表 -->
									<!-- <el-table
										:data="orders"
										stripe border
										highlight-current-row
									>
										<el-table-column prop="order_id" label="订单号" width="80px"></el-table-column>
										<el-table-column prop="r_name" label="收件人" width="80px"></el-table-column>
										<el-table-column prop="r_address" label="地址" width="340px"></el-table-column>
										<el-table-column prop="type" label="货物种类" width="100px"></el-table-column>
										<el-table-column prop="urgent" label="紧急" width="70px"></el-table-column>
										<el-table-column prop="status" label="订单状态" width="80px"></el-table-column>
										<el-table-column prop="allocate" label="分配车辆" width="80px"></el-table-column>
										<el-table-column
											label="查看订单"
											width="80px"
											v-slot="scope"
										>
											<template style="display:table">
												<el-button
													@click.native.prevent="chooseRow(scope.$index, orders)"
													type="text"
												>订单详情</el-button>
											</template>
										</el-table-column>
									</el-table> -->
									<!-- 订单列表END -->

									<!-- 订单列表 -->
									<div v-if="orders.length>0">
										<div
											v-for="(order,index) in orders" :key="index"
											class="order-list"
										>
											<div class="order-list-header" :class="order.status==0&&order.rating!=0?'header-finished':'header-unfinished'">
												<span v-if="order.status==1">
													<div class="header-title header-title-unfinished" v-if="order.r_name!=username">等待对方接收</div>
													<div class="header-title header-title-unfinished" v-else>待接收</div>
												</span>
												<span v-else>
													<div class="header-title header-title-unfinished" v-if="order.rating==0">未评价</div>
													<div class="header-title header-title-finished" v-else>已完成</div>
												</span>
												<div class="header-info">
													<span class="info">{{$filters.dateFormat(order.created_at)}}</span>
													<span class="cut">|</span>
													<span class="info">订单号：{{order.order_id}}</span>
													<span class="cut">|</span>
													<span class="info" v-if="order.allocate==0" style="color:red;">暂未分配车辆</span>
													<span class="info" v-else>分配车辆：{{order.allocate}}</span>
												</div>
											</div>
											<div class="order-list-content" :class="order.status==0&&order.rating!=0?'content-finished':'content-unfinished'">
												<div class="content-info">
													<p>
														货物种类：{{order.type}}
														<span v-if="order.urgent" style="color:red;">&emsp;紧急</span>
													</p>
													<p>
														<span v-if="order.r_name==username">
															发件人信息：{{order.s_name}}&emsp;{{order.s_phone}}&emsp;{{order.s_address}}
														</span>
														<span v-else>
															收件人信息：{{order.r_name}}&emsp;{{order.r_phone}}&emsp;{{order.r_address}}
														</span>
													</p>
													<p>
														订单评分<span v-if="order.rating==0" style="font-size: 14px;">（暂未评分）</span>：
														<el-rate
															style="display: inline"
															v-model="order.rating"
															:colors="['#99A9BF', '#F7BA2A', '#FF9900']"
															show-text
															:texts="['很差', '较差', '一般', '满意', '完美']"
															:disabled="order.rating!=0"
															@change="handleRate(index)">
															<!-- @change的函数的参数默认为value，但可覆盖？ -->
														</el-rate>
													</p>
												</div>
												<div class="operate">
													<router-link :to="{ name: 'OrderDetail', query: {order_id: order.order_id} }">
														<el-button class="button">查看订单详情</el-button>
													</router-link>
												</div>
											</div>
										</div>
									</div>
									<div v-else class="empty">
										<p>您现在还没有订单哦</p>
										<p @click="toSubmit()">----戳我去下订单----</p>
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
import Sidebar from '@/components/Sidebar'
import * as OrderAPI from '@/api/order'
import { ElMessage } from 'element-plus'

export default {
	name: 'Order',
	data() {
		return{
			username: '',
			// 查询
			orders: [],
			total: 0,
			type: -1, // 查询方式：0：所有，1：发出，2：待接收，3：已完成但未评价（初始为-1，以供watch更新）
			limit: 5, // 单次查询数量
			offset: 0, // 查询开始标号
			// 页面展示
			activeTab: '0', // 当前激活的标签页，注意是String
		}
	},
	activated() {
		if (this.$route.query.type != undefined) {
			this.type = this.$route.query.type
		} else {
			this.type = 0
		}
		this.activeTab = this.type+''
		this.username = this.$store.getters.getUser.username
		// toString(this.type) 注意不能直接用toString！需自己定义
		// Number加一个空字符串''可直接转String
	},
	watch: {
		// 监听type变化，请求数据，而不是用created？
		type: function() {
			this.getOrder()
		}
	},
	methods: {
		clickOn(index) {
			this.$router.push({
				path: '/order',
				query: {type: index},
			})
		},
		toSubmit() {
			this.$router.push({path: '/submit'})
		},
		getOrder() {
			var user = this.$store.getters.getUser
			OrderAPI
				.getOrder(user.id, user.username, this.limit, this.offset, this.type)
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
		// chooseRow(index, table) {
		// 	this.$router.push({
		// 		path: '/detail',
		// 		query: {order_id: table[index].id}, // 跳转到指定订单详情
		// 	})
		// },
		handleRate(index) {
			OrderAPI
				.rateOrder(this.orders[index].id, this.orders[index].rating)
				.then(res => {
					if (res.status === 200) {
						ElMessage({
							message: '订单评价成功',
							type: 'success',
						})
						if (this.orders[index].status == 3) {
							this.orders[index].status = 0
						}
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						this.orders[index].rating = 0 // 在当前页面复原成未评分（el-rate点击就会更改）
						ElMessage.error('订单评价失败：'+res.msg)
					}
				})
				.catch(err => {
					this.orders[index].rating = 0 // 在当前页面复原成未评分
					ElMessage.error('订单评价失败：'+err)
				})
		},
		handlePageChange(value) {
			// 参数为当前页数
			this.offset = this.limit * (value - 1)
			this.getOrder()
		}
	},
	components: {
		Sidebar
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
	width: 126px;
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