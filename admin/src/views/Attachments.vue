<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center align-center>
			<v-flex xs12>
				<attachment-selector :select_mode="false" :allow_cancel="false"
				/>
			</v-flex>
      </v-layout>
	</v-container>
</template>

<script>

export default {
   name: 'AttachmentsView',
   data () {
		return {
			
		}
   },
   beforeMount(){
		
	},
   methods: {
		
	}
}
</script>

<style>

</style>