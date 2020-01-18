<template>
	<v-container fill-height fluid>
		Home 

	   
	</v-container>
</template>

<script>
export default {
	name: 'HomeView',
	data() {
		return {
			dialog: false,
		}
	},
	created(){
		Bus.$on('action-selected', this.onActionSelected);
	},
	beforeMount() {
		
	},
	methods: {
		test() {
			this.dialog = true;
		},
		onActionSelected(name) {
         alert('onActionSelected');
      },
	}
}
</script>
