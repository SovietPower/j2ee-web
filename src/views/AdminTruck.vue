<template>
	<div class="admin-truck">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<AdminSidebar></AdminSidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>货车管理</p>
						</div>

						<el-popconfirm
							title="确认要添加货车吗？"
							confirm-button-text="是"
							cancel-button-text="否"
							@confirm="createTruck()"
						>
							<template #reference>
								<el-button type="primary" size="medium" color="#626aef" plain>
									<el-icon><plus /></el-icon>
									添加货车
								</el-button>
							</template>
						</el-popconfirm>

						<div class="content-body">
							<el-table :data="trucks" stripe header-align="center">
								<el-table-column
									type="expand"
									v-slot="scope"
								>
									<el-form label-position="left" class="table-expand" v-if="scope.row.Allocated">
										<el-form-item label="发货地址：">
											<span>{{ scope.row.SAddress }}</span>
										</el-form-item>
										<el-form-item label="收货地址：">
											<span>{{ scope.row.RAddress }}</span>
										</el-form-item>
									</el-form>
								</el-table-column>
								<el-table-column prop="ID" label="编号" width="60px"></el-table-column>
								<el-table-column label="状态" width="70px" v-slot="scope">
									<span v-if="scope.row.Status==0">
										正常
									</span>
									<span v-else style="color: red;">
										不可用
									</span>
								</el-table-column>
								<el-table-column label="分配信息" width="90px" v-slot="scope">
									<span v-if="scope.row.Allocated==0">
										未分配
									</span>
									<span v-else style="color: red;">
										已分配
									</span>
								</el-table-column>
								<el-table-column label="分配的订单号" width="170px" v-slot="scope">
									<span v-if="scope.row.Allocated==0" class="unallocated">
										暂无
									</span>
									<span v-else style="color: brown;">
										{{scope.row.OrderID}}
									</span>
								</el-table-column>
								<el-table-column label="分配货物种类" width="130px" v-slot="scope">
									<span v-if="scope.row.Allocated==0" class="unallocated">
										暂无
									</span>
									<span v-else>
										{{scope.row.Type}}
									</span>
								</el-table-column>
								<el-table-column label="上次更新时间" width="190px" v-slot="scope">
									{{$filters.dateFormat(scope.row.UpdatedAt)}}
								</el-table-column>
								<el-table-column
									label="操作"
									width="150px"
									v-slot="scope"
								>
									<template style="display: table;">
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
						</div>
					</div>

					<!-- content外的内容 -->
					<!-- 分配货车 -->
					<el-dialog
						title="确认"
						v-model="showDialog"
						width="30%"
					>
						<el-input
							v-model="orderID" placeholder="请输入要分配的订单号"
							maxlength="14"
							show-word-limit
						>
							<template #prepend>订单号：</template>
						</el-input>
						<template #footer class="dialog-footer">
							<el-button @click="showDialog = false">取 消</el-button>
							<el-button type="primary" @click="allocateTruck()">确 定</el-button>
						</template>
					</el-dialog>
					<!-- 分配货车END -->


				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar'
import * as TruckAPI from '@/api/truck'
import { ElMessage } from 'element-plus'

export default {
	name: 'AdminTruck',
	data() {
		return{
			trucks: [], // 货车列表
			orderID: '',
			truckChosen: 0,
			showDialog: false,
		}
	},
	created() {
		this.getTruck()
	},
	methods: {
		// 添加货车
		createTruck() {
			TruckAPI
				.createTruck()
				.then(res => {
					if (res.status === 200) {
						this.trucks = res.data
						ElMessage({
							message: '添加货车成功',
							type: 'success',
						})
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('添加货车失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('添加货车失败：'+err)
				})
		},
		// 分配车辆
		chooseRow(index, table) {
			if (table[index].Allocated == 1) {
				ElMessage.error('该货车目前无法分配哦')
				return
			}
			this.orderID = ''
			this.showDialog = true
			this.truckChosen = table[index]
		},
		allocateTruck() {
			if (/^[0-9]+$/.test(this.orderID) == false || this.orderID.length!=14) {
				ElMessage.error('请输入合法订单号')
				return
			}
			this
				.$confirm('确认要分配车辆 '+this.truckChosen.ID+' 到订单 '+this.orderID+' 吗？', '确认', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					TruckAPI
						.allocateTruck(this.truckChosen.ID, this.orderID)
						.then(res => {
							if (res.status === 200) {
								ElMessage({
									message: '分配成功',
									type: 'success',
								})
								setTimeout(() => {
									location.reload()
								}, 1000);
							} else if (res.status === 400) {
								ElMessage.error('该订单已分配')
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
	},
	components: {
		AdminSidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>
/* 信息表格 */
.admin-truck :deep() .el-table .el-table__cell {
	padding: 5px 0;
	font-size: 16px;
}

.admin-truck .table-expand {
	font-size: 0;
	background-color: #f0fcff;
}
.admin-truck .table-expand label {
	width: 90px;
	color: #99a9bf;
}
.admin-truck :deep() .table-expand .el-form-item {
	margin: 0 0 0 30px;
	width: 50%;
}
.admin-truck :deep() .table-expand .el-form-item__label {
	font-size: medium;
}
/* 信息表格END */

.admin-truck .unallocated {
	color: #adadad;
}


</style>