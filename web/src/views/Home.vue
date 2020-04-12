<template>
	<v-container>
		
	</v-container>
</template>

<script>

export default {
	name: 'HomeView',
	data() {
		return {}
	},
	created(){
		
	},
	beforeMount() {
		this.$router.push({ name: 'rqs' });
	},
	methods: {
		
	}
}
</script>
