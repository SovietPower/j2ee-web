<template>
	<div class="order-detail">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<AdminSidebar></AdminSidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>订单详情</p>
						</div>

						<div class="content-body" v-if="order!=0">
							<!-- 顶部区域 -->
							<div class="header">
								<div class="order-id">订单号：{{order.order_id}}</div>
								<div class="order-button" v-if="order.status==1||order.status==2">
									<router-link :to="{name: 'AdminOrder'}">
										<el-button class="button-cancel" type="info" size="small" style="width:120px" plain>返回</el-button>
									</router-link>
									<el-button class="button-confirm" size="small" style="width:120px" @click="clickAllocate()">分配货车</el-button>
								</div>
							</div>
							<!-- 顶部区域END -->

							<!-- 步骤条 -->
							<div class="step-title step-title-unfinished" v-if="order.status==1">等待对方接收</div>
							<div class="step-title step-title-unfinished" v-else-if="order.status==2">待接收</div>
							<div class="step-title step-title-unfinished" v-else-if="order.status==3">未评价</div>
							<div class="step-title step-title-finished" v-else>已完成</div>

							<!-- 预计送达时间 -->
							<div class="evaluate-time" v-if="order.status==1||order.status==2">
								预计送达时间：{{$filters.dateFormat(order.time)}}
							</div>
							<!-- 预计送达时间END -->

							<div class="step">
								<el-steps
									:space="200"
									:active="activeStep"
									finish-status="success"
									align-center
								>
									<el-step title="创建订单" :description="$filters.dateFormat(order.created_at)"></el-step>

									<el-step title="管理员确认并分配" :description="allocateDescription" v-if="activeStep!=1"></el-step>
									<el-step title="管理员确认并分配" v-else></el-step>
									<!-- 这里order应再加一个值allocated_at -->

									<el-step title="运输中"></el-step>

									<el-step title="订单送达" :description="$filters.dateFormat(order.updated_at)" v-if="activeStep==4"></el-step>
									<el-step title="订单送达" v-else></el-step>
								</el-steps>

								<div class="extra"></div>
								<div class="extra"></div>
							</div>
							<!-- 步骤条END -->

							<!-- 收发件人信息 -->
							<div class="order-content">
								<div class="order-content-title">发件人信息</div>
								<div class="order-content-inner">
									<div class="order-content-header">
										<p>姓名：</p>
										<p>联系电话：</p>
										<p>发件地址：</p>
									</div>
									<div class="order-content-data">
										<p>{{order.s_name}}</p>
										<p>{{order.s_phone}}</p>
										<p>{{order.s_address}}</p>
									</div>
								</div>
							</div>
							<div class="order-content">
								<div class="order-content-title">收件人信息</div>
								<div class="order-content-inner">
									<div class="order-content-header">
										<p>姓名：</p>
										<p>联系电话：</p>
										<p>收件地址：</p>
									</div>
									<div class="order-content-data">
										<p>{{order.r_name}}</p>
										<p>{{order.r_phone}}</p>
										<p>{{order.r_address}}</p>
									</div>
								</div>
							</div>
							<!-- 收发件人信息END -->

							<!-- 货物信息 -->
							<div class="order-content">
								<div class="order-content-title">货物信息</div>
								<!-- 固定高度是不行的，要调margin -->
								<div class="order-content-inner">
									<div class="order-content-header">
										<p v-if="order.urgent" style="color: red;">{{'紧急'}}</p>
										<p>货物种类：</p>
										<p>货物重量：</p>
										<p>货物体积：</p>
										<p>货物价值：</p>
										<p>订单评分：</p>
										<p>备注：</p>
									</div>
									<div class="order-content-data">
										<p v-if="order.urgent">&emsp;</p>
										<p>{{order.type}}</p>
										<p>{{order.weight}}&ensp;kg</p>
										<p>{{order.volume}}&ensp;m³</p>
										<p>{{order.value}}&ensp;元</p>
										<p v-if="order.rating==0">暂未评分</p>
										<p v-else>
											<el-rate
												style="display: inline"
												v-model="order.rating"
												:colors="['#99A9BF', '#F7BA2A', '#FF9900']"
												show-text
												:texts="['很差', '较差', '一般', '满意', '完美']"
												disabled>
											</el-rate>
										</p>
										<!-- 备注可能为空，所以需加空格填充，否则不会显示该p -->
										<p>{{order.note}}&emsp;</p>
									</div>
								</div>
							</div>
							<!-- 货物信息END -->

						</div>
						<div class="not-found" v-else>
							查询不到该订单哦
						</div>
					</div>

					<!-- content外的内容 -->
					<!-- 货车选择Drawer弹出框 -->
					<el-drawer
						title="选择货车"
						v-model="showDrawer"
						direction="rtl"
						size="50%"
					>
						<el-table :data="trucks" stripe>
							<el-table-column
								type="expand"
								v-slot="scope"
							>
								<el-form label-position="left" class="table-expand" v-if="scope.row.Allocated">
									<el-form-item label="货物种类：">
										<span>{{ scope.row.Type }}</span>
									</el-form-item>
									<el-form-item label="发货地址：">
										<span>{{ scope.row.SAddress }}</span>
									</el-form-item>
									<el-form-item label="收货地址：">
										<span>{{ scope.row.RAddress }}</span>
									</el-form-item>
								</el-form>
							</el-table-column>
							<el-table-column prop="ID" label="编号" width="80px"></el-table-column>
							<el-table-column label="状态" width="70px" v-slot="scope">
								<span v-if="scope.row.Status==0">
									正常
								</span>
								<span v-else style="color: red;">
									不可用
								</span>
							</el-table-column>
							<el-table-column label="分配信息" width="100px" v-slot="scope">
								<span v-if="scope.row.Allocated==0">
									未分配
								</span>
								<span v-else style="color: red;">
									已分配
								</span>
							</el-table-column>
							<el-table-column label="分配的订单号" width="220px" v-slot="scope">
								<span v-if="scope.row.Allocated==0" class="unallocated">
									暂无
								</span>
								<span v-else style="color: brown;">
									{{scope.row.OrderID}}
								</span>
							</el-table-column>
							<el-table-column
								label="操作"
								width="160px"
								v-slot="scope"
							>
								<template style="display:table">
									<el-button
										@click.native.prevent="chooseRow(scope.$index, trucks)"
										type="text"
									>分配</el-button>
									<el-button
										@click.native.prevent="showOrder(scope.$index, trucks)"
										type="text"
									>查看订单</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-drawer>
					<!-- 货车选择Drawer弹出框END -->

				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar'
import * as AdminOrderAPI from '@/api/admin_order'
import * as TruckAPI from '@/api/truck'
import { ElMessage } from 'element-plus'

export default {
	name: 'AdminOrderDetail',
	data() {
		return{
			order: 0,
			orderID: 0,
			activeStep: 1,
			// 货车选择Drawer
			showDrawer: false,
			trucks: [], // 货车列表
		}
	},
	activated() {
		if (this.$route.query.order_id != undefined) {
			this.orderID = this.$route.query.order_id
		}
		this.getOrderDetail() // 要在更新OrderID后再请求！
		this.getTruck()
	},
	watch: {
		orderID: function() {
			this.getOrderDetail()
		}
	},
	computed: {
		allocateDescription() {
			return this.$filters.dateFormat(this.order.updated_at)+'\n分配货车：'+ this.order.allocate
		}
	},
	methods: {
		clickAllocate() {
			if (this.order.allocate != 0) {
				ElMessage.error('该订单已分配货车')
				return
			}
			this.showDrawer = true
		},
		chooseRow(index, table) {
			if (table[index].Allocated == 1) {
				ElMessage.error('该货车目前无法分配哦')
				return
			}
			this
				.$confirm('确认要分配车辆 '+table[index].ID+' 到订单 '+this.orderID+' 吗？', '确认', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					this.showDrawer = false
					TruckAPI
						.allocateTruck(table[index].ID, this.orderID)
						.then(res => {
							if (res.status === 200) {
								location.reload()
								setTimeout(() => {
									ElMessage({
										message: '分配成功',
										type: 'success',
									})
								}, 1500);
							} else if (res.status === 20001) {
								this.loginExpired(res.msg)
							} else {
								ElMessage.error('分配货车失败：'+res.msg)
							}
						})
						.catch(err => {
							ElMessage.error('分配货车失败：'+err)
						})
				})
				.catch(() => {
					ElMessage({
						message: '取消分配',
						type: 'info',
					})
				})
		},
		showOrder(index, table) {
			if (table[index].Allocated == 0) {
				ElMessage.error('该货车还没有分配哦')
				return
			}
			let path = this.$router.resolve({
				name: "AdminOrderDetail",
				query: {order_id: table[index].OrderID}
			})
			window.open(path.href, '_blank')
		},
		getTruck() {
			TruckAPI
				.getTruck()
				.then(res => {
					if (res.status === 200) {
						this.trucks = res.data
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取货车信息失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取货车信息失败：'+err)
				})
		},
		getOrderDetail() {
			AdminOrderAPI
				.showOrder(this.orderID)
				.then(res => {
					if (res.status === 200) {
						if (res.data != undefined) {
							this.order = res.data

							// 更新进度条显示状态
							if (this.order.status == 0 || this.order.status == 3) {
								this.activeStep = 4
							}
							else if (this.order.allocate != 0) {
								this.activeStep = 2
							}
							else this.activeStep = 1
						}
						else {
							ElMessage.error('获取订单详情失败：'+res.msg)
						}
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取订单详情失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取订单详情失败：'+err)
				})
		},
	},
	components: {
		AdminSidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>
/* 货车选择Drawer */
.order-detail :deep() .el-drawer__body {
	overflow: auto;
}
.order-detail :deep() .el-table .el-table__cell {
	padding: 5px 0;
	font-size: 16px;
}

.order-detail .table-expand {
	font-size: 0;
	background-color: #f0fcff;
}
.order-detail .table-expand label {
	width: 90px;
	color: #99a9bf;
}
.order-detail :deep() .table-expand .el-form-item {
	margin: 0 0 0 25px;
	width: 50%;
}

.order-detail .unallocated {
	color: #adadad;
}
/* 货车选择Drawer END */

/* 顶部区域 */
.content .header {
	display: flex;
	border-bottom: 1px solid #e0e0e0;
}
.content .header .order-id {
	width: 500px;
	font-size: 18px;
	margin-bottom: 17px;
	color: #242424;
}
.content .header .order-button {
	margin-left: 130px;
}
.content .header .order-button .button-confirm {
	margin-left: 10px;
	background-color: #ff6700;
	color: #ffffff;
}
/* 顶部区域END */

/* 步骤条 */
.content .step-title {
	font-size: 18px;
	margin-top: 20px;
}
.content .step-title-finished {
	color: #00a724;
}
.content .step-title-unfinished {
	color: #ff6700;
}
.content .step {
	margin-top: 40px;
	border-bottom: 1px solid #e0e0e0;
}
/* 步骤条END */

/* 预计时间 */
.content .evaluate-time {
	margin-top: 10px;
	font-size: 16px;
	color: #ff6700;
}
/* 预计时间END */

/* 地址等信息 */
.content .order-content {
	border-bottom: 1px solid #e0e0e0;
}
.content .order-content-inner {
	/* height: 120px; */
	margin: 20px auto;
	height: auto;
	display: flex;
	align-items: baseline;
}
.content .order-content-title {
	color: #242424;
	font-size: 18px;
	margin-top: 20px;
}
.content .order-content-inner .order-content-header {
	min-width: 75px;
	font-size: 15px;
	line-height: 25px;
	font-weight: bold;
	color: #757575;
}
.content .order-content-inner .order-content-data {
	font-size: 15px;
	line-height: 25px;
	color: #757575;
}
/* 地址等信息END */

</style>