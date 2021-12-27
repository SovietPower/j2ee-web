<template>
	<div class="AdminSidebar" id="AdminSidebar">
		<!-- 这里外层el-row的style不能是flex（默认），可以是block。否则:span="24"才有较好的效果 -->
		<!-- 但另一个元素已经分了20，当这个是24且窗口较小时会显示两行；若为正常的4则可在一行内显示 -->
		<!-- 注意要有足够的width，才能显示足够宽，不只与这个值有关 -->
		<el-col :span="4">
			<div class="menu">
				<div class="menu-content">
					<div class="menu-part">
						<p class="submenu">信息管理</p>
						<ul class="menu-ul">
							<li>
								<router-link to="/admin/center" class="menu-a">个人中心</router-link>
							</li>
							<li>
								<router-link to="/message" class="menu-a">未读消息</router-link>
							</li>
							<li>
								<router-link to="/admin/user" class="menu-a">用户管理</router-link>
							</li>
							<li>
								<router-link to="/admin/truck" class="menu-a">车辆管理</router-link>
							</li>
							<li>
								<router-link to="/admin/order" class="menu-a">订单管理</router-link>
							</li>
						</ul>
						<p class="submenu">账户管理</p>
						<ul class="menu-ul">
							<li>
								<router-link to="/admin/info" class="menu-a">修改账户信息</router-link>
							</li>
							<li>
								<router-link to="/admin/change_password" class="menu-a">修改密码</router-link>
							</li>
							<li>
								<router-link to="/admin/address" class="menu-a">常用地址</router-link>
							</li>
						</ul>
						<p class="submenu">关于</p>
						<ul class="menu-ul">
							<li>
								<router-link to="/about" class="menu-a">关于网站</router-link>
							</li>
							<li>
								<a
									href="https://www.zybuluo.com/SovietPower/note/1916979"
									target="_blank"
									class="menu-a"
								>项目地址（前端）</a>
							</li>
							<li>
								<a
									href="https://www.zybuluo.com/SovietPower/note/1916979"
									target="_blank"
									class="menu-a"
								>项目地址（后端）</a>
							</li>
						</ul>
					</div>

					<div class="extra"></div>
				</div>
			</div>
		</el-col>
	</div>
</template>
<script>
export default {
	name: 'AdminSidebar',
	data() {
		return {}
	},
	methods: {}
}
</script>
<style scoped>
.menu {
	background-color: #ffffff;
}
.menu-content {
	width: 120px;
	/* margin: 0 auto; */
	margin-left: 40px;
	margin-right: 30px;
}
.submenu {
	padding-top: 30px;
	padding-bottom: 20px;
}
.menu-ul {
	line-height: 30px;
}
.menu-ul .menu-a {
	font-size: 15px;
	color: #7b7f86;
}
.menu-ul .menu-a:hover {
	color: #ff6700;
}
.extra {
	height: 40px;
}
</style>