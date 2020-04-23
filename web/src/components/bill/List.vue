<template>
   <v-row>
      <v-col cols="12" >
         <v-radio-group v-model="payed" row class="ml-3">
            <v-radio  label="未付款的" :value="false" />
            <v-radio  label="已付款的" :value="true" />
         </v-radio-group>
      </v-col>
   </v-row>
</template>

<script>
export default {
   name: 'BillList',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
			payed: false
		}
	},
}
</script>

<style>

</style>