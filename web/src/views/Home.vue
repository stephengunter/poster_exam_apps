<template>
	<v-container>
		<v-row>
			
			<v-col  cols="12">
				<a :href="`#test_${n}`" v-for="n in 20" :key="n">
				<v-btn   class="mx-2" fab dark small color="primary">
					{{ n }}
				</v-btn>
				</a>
			</v-col>
		</v-row>

	  

		<v-row v-for="n in 20" :key="n" :id="`test_${n}`">
			
			<v-col  cols="12">
				{{ n }}
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'HomeView',
	data() {
		return {
			items: []
		}
	},
	created(){
		
	},
	beforeMount() {
		
	},
	methods: {
		
	}
}
</script>
