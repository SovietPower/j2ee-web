<template>
	<div class="submit" id="submit" name="submit">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<Sidebar></Sidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>创建订单</p>
						</div>

						<div class="content-body">
							<!-- 发件人信息 -->
							<el-divider content-position="left">地址信息</el-divider>
							<el-descriptions
								:column="2"
								border
								:class="sender.seen==true ? 'el-descriptions-hover' : ''"
								@mouseenter="mouseEnter(sender)"
								@mouseleave="mouseLeave(sender)"
							>
								<template #title>
									<div>发件人</div>
								</template>
								<template #extra>
								<div class="operation" v-show="sender.seen">
									<span @click="showSenderDrawer()">选择地址</span>
								</div>
								</template>
								<el-descriptions-item>
									<template #label>
										<el-icon><user /></el-icon>
										姓名
									</template>
									{{sender.name}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><iphone /></el-icon>
										电话
									</template>
									+86 {{sender.phone}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><location /></el-icon>
										详细地址
									</template>
									{{sender.address}}
								</el-descriptions-item>
							</el-descriptions>
							<!-- 发件人信息END -->

							<!-- 收件人信息 -->
							<el-descriptions
								:column="2"
								border
								:class="receiver.seen==true ? 'el-descriptions-hover' : ''"
								@mouseenter="mouseEnter(receiver)"
								@mouseleave="mouseLeave(receiver)"
							>
								<template #title>
									<div>收件人</div>
								</template>
								<template #extra>
								<div class="operation" v-show="receiver.seen">
									<span @click="showReceiverDrawer()">选择地址</span>
								</div>
								</template>
								<el-descriptions-item>
									<template #label>
										<el-icon><user /></el-icon>
										姓名
									</template>
									{{receiver.name}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><iphone /></el-icon>
										电话
									</template>
									+86 {{receiver.phone}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template #label>
										<el-icon><location /></el-icon>
										详细地址
									</template>
									{{receiver.address}}
								</el-descriptions-item>
							</el-descriptions>
							<!-- 收件人信息END -->

							<!-- 货物信息 -->
							<el-divider content-position="left">货物信息</el-divider>
							<div style="margin: 12px;">
								当前可用车辆：{{truckAvailable}}
							</div>
							<el-form ref="orderForm" :model="orderForm" :rules="order_rule" :inline="false" label-width="80px">
								<el-form-item prop="type" label="货物种类" style="width:400px">
									<el-input v-model="orderForm.type" maxlength="6"></el-input>
								</el-form-item>
								<el-form-item prop="weight" label="重量" style="display:inline-flex; width:300px">
									<el-input v-model.number="orderForm.weight">
										<template #append>kg</template>
									</el-input>
								</el-form-item>
								<el-form-item prop="volume" label="体积" style="display:inline-flex; width:300px">
									<el-input v-model.number="orderForm.volume">
										<template #append>立方米</template>
									</el-input>
								</el-form-item>
								<el-form-item prop="value" label="价值" style="display:inline-flex; width:300px">
									<el-input v-model.number="orderForm.value">
										<template #append>元</template>
									</el-input>
								</el-form-item>
								<el-form-item label="紧急">
									<el-switch v-model="orderForm.urgent"></el-switch>
								</el-form-item>
								<el-form-item label="备注">
									<el-input type="textarea" v-model="orderForm.note"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="createOrder">立即创建</el-button>
									<el-button>取消</el-button>
								</el-form-item>
							</el-form>
							<!-- 货物信息END -->
						</div>
					</div>

					<!-- content外的内容 -->
					<!-- 地址选择Drawer弹出框 -->
					<!-- 注意不是官网上的那样，用:visible.sync="showDrawer"，而是v-model -->
					<el-drawer
						title="选择地址"
						v-model="showDrawer"
						direction="rtl"
						size="50%"
						:close-on-press-escape="false"
					>
						<el-button type="primary" size="medium" color="#626aef" plain @click="readyToAdd()">
							<el-icon><plus /></el-icon>
							新建地址
						</el-button>

						<!-- 注意要设置overflow，否则在el-drawer中是没有滚动条的，el-table只能显示部分 -->
						<el-table :data="address" stripe>
							<el-table-column prop="name" label="姓名" width="80px"></el-table-column>
							<el-table-column prop="phone" label="电话" width="140px"></el-table-column>
							<el-table-column prop="address" label="地址" min-width="360px"></el-table-column>
							<el-table-column
								label="操作"
								width="60px"
								v-slot="scope"
								fixed="right"
							>
								<!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）数据 -->
								<!-- 注意不是官网上的template slot-scope="scope"，而是在el-table-column中v-slot="scope" -->
								<template style="display:table">
									<el-button
										@click.native.prevent="chooseRow(scope.$index, address)"
										type="text"
									>选择</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-drawer>
					<!-- 地址选择Drawer弹出框END -->

					<!-- 新建地址弹出框 -->
					<el-dialog title="新建地址" v-model="showAdd" width="30%" :close-on-press-escape="false">
						<el-form ref="addressForm" :model="addressForm" :rules="address_rule" label-width="70px" status-icon>
							<el-form-item prop="name" label="姓名">
								<el-input v-model="addressForm.name" />
							</el-form-item>
							<el-form-item prop="phone" label="手机号">
								<el-input v-model="addressForm.phone">
									<template #prepend>+86</template>
								</el-input>
							</el-form-item>
							<el-form-item prop="address" label="详细地址">
								<el-input type="textarea" rows="5" v-model="addressForm.address" />
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="showAdd = false">取 消</el-button>
								<el-button type="primary" @click="createAddress">确 定</el-button>
							</span>
						</template>
					</el-dialog>
					<!-- 新建地址弹出框END -->
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import Sidebar from '../components/Sidebar'
import * as AddressAPI from '@/api/address'
import * as OrderAPI from '@/api/order'
import * as TruckAPI from '@/api/truck'
import { ElMessage } from 'element-plus'

export default {
	name: 'Submit',
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
		var validateGoodsName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入货物种类'))
			}
			else if (/^[\p{Unified_Ideograph}]+$/u.test(value) == false) {
				callback(new Error('请输入汉字，不含标点符号'))
			}
			callback()
		}
		var validateGoodsNumber = (rule, value, callback) => {
			if (/^[0-9]+$/.test(value) == false) {
				callback(new Error('请输入数字'))
			}
			else if (value <= 0) {
				callback(new Error('请输入合法数值'))
			}
			callback()
		}
		return{
			truckAvailable: 0, // 剩余可用车数，用于给客户预估时间
			orderForm: {
				type: '',
				weight: 0,
				volume: 0,
				value: 0,
				urgent: false,
				note: '',
			},
			// 地址相关
			address: [],
			showAdd: false,
			showDrawer: false,
			sender: '', // 发件人地址结构
			receiver: '', // 收件人地址结构
			modifying: 's', // 正在修改的地址，取值为's'或'r'
			addressForm: { // 用于新建地址
				user_id: '',
				name: '',
				phone: '',
				address: '',
			},
			address_rule: {
				name: [{ validator: validateName, trigger: 'blur'}],
				phone: [{ validator: validatePhone, trigger: 'blur'}],
				address: [{ validator: validateAddress, trigger: 'blur'}],
			},
			order_rule: {
				type: [{validator: validateGoodsName, trigger: 'blur'}],
				weight: [{validator: validateGoodsNumber, trigger: 'blur'}],
				volume: [{validator: validateGoodsNumber, trigger: 'blur'}],
				value: [{validator: validateGoodsNumber, trigger: 'blur'}],
			}
		}
	},
	created() {
		this.getAddress()
		this.getTruckNum()
		// getAddress 与 设置sender, receiver 应同步，但我搞不好async和await。。
		setTimeout(() => {
			if (this.address.length>0) {
				// 注意结构体赋值是赋地址！
				this.sender = this.deepCopy(this.address[0])
				this.receiver = this.deepCopy(this.address[0])
			}
		}, 1000);
		this.sender = {
			name: '',
			phone: '',
			address: '',
			seen: false,
		}
		this.receiver = {
			name: '',
			phone: '',
			address: '',
			seen: false,
		}
	},
	methods: {
		getTruckNum() {
			TruckAPI
				.getTruckByUser()
				.then(res => {
					if (res.status === 200) {
						this.truckAvailable = res.data
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取车辆总数失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取车辆总数失败：'+err)
				})
		},
		createOrder() {
			this.$refs.orderForm.validate(valid => {
				if (!valid) {
					ElMessage.error('请填写并确保内容合法')
					return
				}
				var user = this.$store.getters.getUser
				if (user.status == 1) {
					ElMessage.error('您暂时没有权限')
					return
				}
				OrderAPI
					.createOrder(user.id, this.sender, this.receiver, this.orderForm)
					.then(res => {
						if (res.status === 200) {
							this.$router.push({
								path: '/detail',
								query: {order_id: res.data}, // 跳转到指定订单详情
							})
							ElMessage({
								message: '新建订单成功',
								type: 'success',
							})
						} else if (res.status === 20001) {
							this.loginExpired(res.msg)
						} else {
							ElMessage.error('新建订单失败：'+res.msg)
						}
					})
					.catch(err => {
						ElMessage.error('新建订单失败：'+err)
					})
			})
		},

		// 地址相关
		showSenderDrawer() {
			this.modifying = 's'
			this.showDrawer = true
		},
		showReceiverDrawer() {
			this.modifying = 'r'
			this.showDrawer = true
		},
		chooseRow(index, table) {
			if (this.modifying=='s')
				this.sender = table[index]
			else
				this.receiver = table[index]
			this.showDrawer = false
		},
		readyToAdd() {
			this.showAdd=true
			this.addressForm.name = ''
			this.addressForm.phone = ''
			this.addressForm.address = ''
		},
		mouseEnter(item) {
			item.seen = true
		},
		mouseLeave(item) {
			item.seen = false
		},
		getAddress() {
			AddressAPI
				.getAddress(this.$store.getters.getUser.id)
				.then(res => {
					if (res.status === 200) {
						this.address = res.data
					} else if (res.status === 20001) {
						this.loginExpired(res.msg)
					} else {
						ElMessage.error('获取地址失败：'+res.msg)
					}
				})
				.catch(err => {
					ElMessage.error('获取地址失败：'+err)
				})
		},
		createAddress() {
			this.$refs.addressForm.validate(valid => {
				if (!valid) {
					ElMessage.error('请填写并确保内容合法')
					return
				}
				this.addressForm.user_id = this.$store.getters.getUser.id
				AddressAPI
					.createAddress(this.addressForm)
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
		}
	},
	components: {
		Sidebar,
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>
/* 注意:deep()的元素要从.submit，不要从.content */
.submit :deep() .el-divider__text {
    font-weight: 600;
    font-size: 20px;
}
.submit :deep() .el-divider--horizontal {
	margin: 30px 0;
}

.submit :deep() .el-descriptions {
	margin: 20px 2px;
}
.submit :deep() .el-descriptions__header{
	margin-bottom: 2px;
	height: 20px;
}
.submit :deep() .el-descriptions__label{
	width: 105px;
}
.submit :deep() .el-descriptions__content{
	font-size: 16px;
	font-weight: bold;
	min-width: 150px;
}
.submit .el-descriptions-hover {
	outline: #ffb40c solid 2px;
}

.submit :deep() .el-drawer__body {
	overflow: auto;
}

.content .operation {
	color: #ff6700;
	font-size: 17px;
	float: right;
}
.content .operation span {
	margin-right: 10px;
}

</style>