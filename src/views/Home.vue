<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

	<div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link> |
		<router-link to="/login">Login</router-link>
	</div>
	<div>
		<a href="/#/login">to Login!</a>
	</div>
	<router-view/>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'Home',
	components: {
		// HelloWorld
	}
}
</script>
