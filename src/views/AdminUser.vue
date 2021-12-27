<template>
	<div class="admin-user">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<AdminSidebar></AdminSidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>用户管理</p>
						</div>

						<div class="content-body">
							<el-table :data="users" stripe header-align="center">
								<el-table-column
									type="expand"
									v-slot="scope"
								>
									<el-form label-position="left" class="table-expand">
										<el-form-item label="共发出订单数：">
											<span>{{ scope.row.SendTotal }}</span>
										</el-form-item>
										<el-form-item label="共接收订单数：">
											<span>{{ scope.row.ReceiveTotal }}</span>
										</el-form-item>
										<p>&emsp;</p>
										<el-form-item label="未读消息数：">
											<span>{{ scope.row.MsgNumber }}</span>
										</el-form-item>
										<el-form-item label="已发出（未被接收）订单数：">
											<span>{{ scope.row.SendNumber }}</span>
										</el-form-item>
										<el-form-item label="待接收订单数：">
											<span>{{ scope.row.ReceiveNumber }}</span>
										</el-form-item>
									</el-form>
								</el-table-column>
								<el-table-column prop="UserID" label="编号" width="60px"></el-table-column>
								<el-table-column prop="Username" label="用户名" width="80px"></el-table-column>
								<el-table-column prop="OrderTotal" label="总订单数" width="80px"></el-table-column>
								<el-table-column label="用户状态" width="80px" v-slot="scope">
									<span v-if="scope.row.Status==0">
										正常
									</span>
									<span v-else-if="scope.row.Status==1" style="color: red;">
										受限
									</span>
									<span v-else style="color: grey;">
										封禁
									</span>
								</el-table-column>
								<el-table-column label="权限" width="80px" v-slot="scope">
									<span v-if="scope.row.Authority==0" style="color: #fb365b;">
										管理员
									</span>
									<span v-else>
										普通用户
									</span>
								</el-table-column>
								<el-table-column label="注册时间" width="180px" v-slot="scope">
									{{$filters.dateFormat(scope.row.CreatedAt)}}
								</el-table-column>
								<el-table-column label="上次更新时间" width="180px" v-slot="scope">
									{{$filters.dateFormat(scope.row.UpdatedAt)}}
								</el-table-column>
								<el-table-column
									label="操作"
									width="120px"
									v-slot="scope"
								>
									<template style="display: table;">
										<el-button
											@click.native.prevent="chooseUser(scope.$index, users)"
											type="text"
										>管理</el-button>
										<el-button
											@click.native.prevent="showOrder(scope.$index, users)"
											type="text"
										>查看订单</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>

					<!-- content外的内容 -->
					<!-- 设置用户状态 -->
					<el-dialog
						title="确认"
						v-model="showDialog"
						width="30%"
					>
						<span>
							设置用户状态为：
						</span>
						<el-select v-model="statusChosen" placeholder="选择要设置的用户状态">
							<el-option
								v-for="(item,index) in chooseList"
								:key="index"
								:label="item"
								:value="index">
							</el-option>
						</el-select>
						<template #footer class="dialog-footer">
							<el-button @click="showDialog = false">取 消</el-button>
							<el-button type="primary" @click="setUser()">确 定</el-button>
						</template>
					</el-dialog>
					<!-- 设置用户状态END -->

				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar'
import * as AdminUserAPI from '@/api/admin_user'
import { ElMessage } from 'element-plus'

export default {
	name: 'AdminUser',
	data() {
		return{
			users: [],
			userChosen: 0,
			showDialog: false,

			statusChosen: 0,
			chooseList:  ['正常', '限制功能', '封禁']
		}
	},
	created() {
		this.getUser()
	},
	methods: {
		chooseUser(index, table) {
			this.showDialog = true
			this.userChosen = table[index]
		},
		setUser() {
			this
				.$confirm('确认设置用户 '+this.userChosen.Username+' 的状态为 '+this.chooseList[this.statusChosen]+' 吗？', '确认', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				.then(() => {
					AdminUserAPI
						.setUserStatus(this.userChosen.UserID, this.statusChosen)
						.then(res => {
							if (res.status === 200) {
								ElMessage({
									message: '设置用户状态成功',
									type: 'success',
								})
								setTimeout(() => {
									location.reload()
								}, 1000);
							} else if (res.status === 20001) {
								this.loginExpired(res.msg)
							} else {
								ElMessage.error('设置用户状态失败：'+res.msg)
							}
						})
						.catch(err => {
							ElMessage.error('设置用户状态失败：'+err)
						})
				})
				.catch(() => {
					ElMessage({
						message: '取消设置',
						type: 'info',
					})
				})
		},
		showOrder(index, table) {
			let path = this.$router.resolve({
				name: "AdminOrderByUser",
				query: {user_id: table[index].UserID}
			})
			window.open(path.href, '_blank')
		},
		getUser() {
			AdminUserAPI
				.getUser()
				.then(res => {
					if (res.status === 200) {
						this.users = res.data
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
	},
	components: {
		AdminSidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>

/* 信息表格 */
.admin-user :deep() .el-table .el-table__cell {
	padding: 5px 0;
	font-size: 15px;
}

.admin-user .table-expand {
	font-size: 0;
	background-color: #f0fcff;
}
.admin-user .table-expand label {
	width: 90px;
	color: #99a9bf;
}
.admin-user :deep() .table-expand .el-form-item {
	margin: 0 0 0 30px;
	width: 50%;
}
.admin-user :deep() .table-expand .el-form-item__label {
	font-size: medium;
}
/* 信息表格END */

</style>