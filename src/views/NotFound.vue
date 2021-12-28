<template>
	<el-empty>
		<p>页面暂时没有实现 或找不到该网页</p>
		<el-button type="primary" @click="toHome()">返回首页</el-button>
	</el-empty>
</template>

<script>
export default {
	methods: {
		toHome() {
			this.$router.push({
				name: 'Home'
			})
		}
	}
}
</script>

<style>

</style>