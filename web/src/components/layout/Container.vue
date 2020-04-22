<template>
	<v-content>
		<div class="main-container">
			<router-view />
		</div>
		<v-footer color="success" app>
      	<span class="white--text">&copy; 2020</span>
			<span class="white--text ml-3">考試學習器</span>
    	</v-footer>
	</v-content>
</template>

<script>
export default {
	name: 'TheContainer'
}
</script>

<style>
.main-container {
   padding-bottom: 100px;
}
</style>
