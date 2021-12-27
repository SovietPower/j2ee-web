<template>
	<div class="..." id="..." name="...">
		<div class="layout">
			<el-row :gutter="10" style="display:block;">
				<div>
					<Sidebar></Sidebar>
				</div>
				<el-col :span="20">
					<div class="content">
						<div class="extra"></div>
						<div class="content-title">
							<p>title</p>
						</div>

						<div class="content-body">

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
// import * as AddressAPI from '@/api/address'
// import { ElMessage } from 'element-plus'

export default {
	name: '',
	data() {
		return{

		}
	},
	methods: {

	},
	components: {
		Sidebar
	}
}
</script>

<style scoped src="../style/content.css"></style>
<style scoped>


</style>