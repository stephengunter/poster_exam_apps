<template>
   <v-card v-if="model">
      <v-card-text>
         <v-row>
            <v-col cols="12">
               <subscribe-plan :model="model.plan" mode="summary"
               />
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12">
               <h2>付款方式</h2>
               <v-radio-group v-model="model.payWayId">
                  <v-radio  v-for="(item, index) in payway_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>
            </v-col>
         </v-row>
         
      </v-card-text>
      <v-card-actions>
         <v-btn color="success" large class="ml-2" @click.prevent="onSubmit">
            確認送出
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'SubscribeConfirm',
   props: {
      model: {
         type: Object,
         default: null
      },
      payway_options: {
         type: Array,
         default: null
      },
   },
   data() {
		return {
			
		}
	},
   computed: {
   },
   methods: {
		onSubmit() {
         this.$emit('submit')
      }
	}
}
</script>