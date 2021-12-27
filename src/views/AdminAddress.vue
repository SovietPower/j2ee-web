<template>
	<div class="address" id="address" name="address">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<AdminSidebar></AdminSidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>常用地址</p>
						</div>
						<el-button type="primary" size="medium" color="#626aef" plain @click="readyToAdd()">
							<el-icon><plus /></el-icon>
							添加新地址
						</el-button>

						<div class="content-body">
							<el-descriptions
								:column="2"
								border
								:class="item.seen==true ? 'el-descriptions-hover' : ''"
								v-for="(item, index) in address"
								:key="item.id"
								@mouseenter="mouseEnter(item)"
								@mouseleave="mouseLeave(item)"
							>
								<template #title>
									<div v-show="item.pinned">
										已置顶
									</div>
								</template>
								<!-- 内部只能使用template #title 或  #extra添加元素，一个左上一个右上 -->
								<template #extra>
								<div class="operation" v-show="item.seen">
									<span @click="editPin(item)">{{item.pinned==true?'取消':''}}置顶</span>
									<span @click="editInfo(item)">修改</span>
									<el-popconfirm
										title="确认要删除该地址吗？"
										confirm-button-text="是"
										cancel-button-text="否"
										icon-color="red"
										@confirm="deleteAddress"
									>
										<template #reference>
											<span @click="deleteDialog(item.id,index)">删除</span>
										</template>
									</el-popconfirm>
									<!-- <span @click="deleteDialog(item.id,index)">删除</span> -->
								</div>
								</template>
								<el-descriptions-item>
									<template #label>
										<el-icon><user /></el-icon>
										姓名
									</template>
									{{item.name}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><iphone /></el-icon>
										电话
									</template>
									+86 {{item.phone}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><location /></el-icon>
										详细地址
									</template>
									{{item.address}}
								</el-descriptions-item>
							</el-descriptions>
						</div>
					</div>

					<!-- 新建地址弹出框 -->
					<el-dialog title="新建地址" v-model="showAdd" width="30%">
						<el-form ref="form" :model="form" :rules="rules" label-width="70px" status-icon>
							<el-form-item prop="name" label="姓名">
								<el-input v-model="form.name" />
							</el-form-item>
							<el-form-item prop="phone" label="手机号">
								<el-input v-model="form.phone">
									<template #prepend>+86</template>
								</el-input>
							</el-form-item>
							<el-form-item prop="address" label="详细地址">
								<el-input type="textarea" rows="5" v-model="form.address" />
							</el-form-item>
						</el-form>
						<!-- 注意要在template上加入具名为footer的slot。slot不可在span上加 -->
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="showAdd = false">取 消</el-button>
								<el-button type="primary" @click="createAddress">确 定</el-button>
							</span>
						</template>
					</el-dialog>
					<!-- 新建地址弹出框END -->

					<!-- 修改地址弹出框 -->
					<el-dialog title="修改地址" v-model="showEdit" width="30%">
						<el-form ref="form" :model="form" :rules="rules" label-width="70px" status-icon>
							<el-form-item prop="name" label="姓名">
								<el-input v-model="form.name"></el-input>
							</el-form-item>
							<el-form-item prop="phone" label="手机号">
								<el-input v-model="form.phone">
									<template #prepend>+86</template>
								</el-input>
							</el-form-item>
							<el-form-item prop="address" label="详细地址">
								<el-input type="textarea" rows="5" v-model="form.address"></el-input>
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="showEdit = false">取 消</el-button>
								<el-button type="primary" @click="modifyAddress">确 定</el-button>
							</span>
						</template>
					</el-dialog>
					<!-- 修改地址弹出框END -->
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import AdminSidebar from '../components/AdminSidebar'
import * as AddressAPI from '@/api/address'
import { ElMessage } from 'element-plus'

export default {
	name: 'AdminAddress',
	data() {
		var validateName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入收件人或发件人姓名'))
			}
			else if (/^[A-Za-z\p{Unified_Ideograph}]+$/u.test(value) == false) {
				callback(new Error('请输入字母或汉字，不含标点符号'))
			}
			callback()
		}
		var validatePhone = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'))
			}
			else if (/^(13[0-9]|14[5-9]|15[0-3,5-9]|166|17[1-8]|18[0-9]|19[0-3,5-9])\d{8}$/.test(value) == false) {
				callback(new Error('请输入合法的手机号'))
			}
			callback()
		}
		var validateAddress = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入地址'))
			}
			// todo 更高级的输入方式或验证
			callback()
		}
		return {
			address: [],
			showAdd: false,
			showEdit: false,
			addressID: 0,
			addressIndex: 0,
			form: { // 用于发送到后端以更新地址
				id: '', // 在数据库中的编号，用于更新
				user_id: '',
				name: '',
				phone: '',
				address: '',
				pinned: ''
			},
			rules: {
				name: [{ validator: validateName, trigger: 'blur'}],
				phone: [{ validator: validatePhone, trigger: 'blur'}],
				address: [{ validator: validateAddress, trigger: 'blur'}]
			}
		}
	},
	created() {
		this.getAddress()
	},
	methods: {
		readyToAdd() {
			this.showAdd=true
			this.form.name = ''
			this.form.phone = ''
			this.form.address = ''
		},
		getAddress() {
			AddressAPI
				.getAddress(this.$store.getters.getUser.id)
				.then(res => {
					if (res.status === 200) {
						this.address = res.data
					} else if (res.status === 20001) {
						//token过期，需要重新登录
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取地址失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取地址失败：'+err)
				})
		},
		mouseEnter(item) {
			item.seen = true
		},
		mouseLeave(item) {
			item.seen = false
		},
		deleteDialog(val, index) {
			this.addressID = val
			this.addressIndex = index
		},
		editInfo(item) {
			this.showEdit = true

			// 此处获取要修改的item。因为点击button时获取不到当前item。
			// 注意应使用item的副本（深拷贝），否则修改form时，会同时修改item的内容（结构体赋值拷贝是传地址）。
			// this.form = item
			this.form = this.deepCopy(item)
		},
		editPin(item) {
			let cancel = item.pinned==true?'取消':''
			// API执行成功后，再修改item.pinned。或者不需要修改，因为会返回新的列表。
			// item.pinned = status==true?false:true // 异或会转成int，而不再是bool

			AddressAPI
				.updateAddressPin(item.id, item.user_id, item.pinned==true?false:true)
				.then(res => {
					if (res.status === 200) {
						this.address = res.data
						ElMessage({
							message: cancel+'置顶成功',
							type: 'success'
						})
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error(cancel+'置顶失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error(cancel+'置顶失败：'+err)
				})
		},
		createAddress() {
			this.$refs.form.validate(valid => {
				if (!valid) {
					ElMessage.error('请填写并确保内容合法')
					return
				}
				this.form.user_id = this.$store.getters.getUser.id
				AddressAPI
					.createAddress(this.form)
					.then(res => {
						if (res.status === 200) {
							this.address = res.data
							this.showAdd = false
							ElMessage({
								message: '新建地址成功',
								type: 'success'
							})
						} else if (res.status === 20001) {
							this.loginExpired(res.msg)
						} else {
							ElMessage.error('新建地址失败：'+res.msg)
						}
					})
					.catch(err => {
						ElMessage.error('新建地址失败：'+err)
					})
			})
		},
		modifyAddress() {
			this.$refs.form.validate(valid => {
				if (!valid) {
					ElMessage.error('请填写并确保内容合法')
					return
				}
				this.form.user_id = this.$store.getters.getUser.id
				AddressAPI
					.updateAddress(this.form)
					.then(res => {
						if (res.status === 200) {
							this.address = res.data
							this.showEdit = false
							ElMessage({
								message: '修改地址成功',
								type: 'success'
							})
						} else if (res.status === 20001) {
							this.loginExpired(res.msg)
						} else {
							ElMessage.error('修改地址失败：'+res.msg)
						}
					})
					.catch(err => {
						ElMessage.error('修改地址失败：'+err)
					})
			})
		},
		deleteAddress() {
			AddressAPI
				.deleteAddress(this.addressID)
				.then(res => {
					if (res.status === 200) {
						this.address.splice(this.addressIndex, 1)
						ElMessage({
							message: '删除地址成功',
							type: 'success'
						})
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('删除地址失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('删除地址失败：'+err)
				})
		}
	},
	components: {
		AdminSidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>
.address :deep() .el-descriptions {
	margin: 20px 2px;
}

.address :deep() .el-descriptions__header{
	margin-bottom: 2px;
	height: 20px;
}

.address :deep() .el-descriptions__label{
	width: 105px;
}

.address :deep() .el-descriptions__content{
	font-size: 16px;
	font-weight: bold;
	min-width: 150px;
}

.address .el-descriptions-hover {
	outline: #ffb40c solid 2px;
}

/*
迁移到content.css中
.layout {
	max-width: 1225px;
	margin: 0 auto;
}
.content {
	padding: 0 100px;
	background-color: #ffffff;
	margin-bottom: 30px;
}
.address-title {
	height: 100px;
	display: flex;
	align-items: center;
}
.address-title p {
	font-size: 30px;
	color: #757575;
	margin-left: 50px;
}
.extra {
	height: 10px;
}
.address .content-body {
	overflow: hidden;
	width: 910px;
	margin: 0 auto;
}
.address .content-body .in-section {
	border: 1px solid #ff6700;
} */

.content .operation {
	color: #ff6700;
	font-size: 17px;
	float: right;
}
.content .operation span {
	margin-right: 10px;
}

.address .add-address {
	text-align: center;
	line-height: 30px;
}
.address .add-address i {
	font-size: 30px;
	padding-top: 50px;
	text-align: center;
}

.address .delete-dialog {
	margin: 0 auto;
	width: 180px;
	font-size: 20px;
}
</style>