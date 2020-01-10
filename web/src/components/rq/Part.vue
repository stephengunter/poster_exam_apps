<template>
   <div>
      <v-row v-show="title">
         <v-col cols="12">
            <h5> {{ title }} </h5>
         </v-col>
		</v-row>
   </div>
</template>

<script>
export default {
   name: 'RQ_Part',
   props: {
		title: {
         type: String,
         default: ''
		},
		model: {
         type: Object,
         default: null
      },
	},
}
</script>

<style>

</style>