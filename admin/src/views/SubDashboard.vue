<template>
<div>


   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<question-header ref="questionHeader" 
					:params="params" :multi_recruits="false"
					@params-changed="onParamsChanged" @create="create"
					/>
				</material-card>
			</v-flex>
      </v-layout>
	</v-container>
</div>
</template>

<script>
export default {
   name: 'SubDashboard',
   data() {
      return {
         params: {
            subject: 0,
				term: 0,
				recruits: ''
         },
      }
   },
   beforeMount() {
      
      
   },
   mounted() {
     
   },
   methods: {
      create() {

      },
      onParamsChanged() {
          console.log('onParamsChanged');
           console.log('params', this.params);
      }
   }
}
</script>