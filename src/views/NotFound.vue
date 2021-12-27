<template>
	<el-empty>
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