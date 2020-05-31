<template>
   <v-layout row wrap>
      <v-flex xs12 sm4 md4>
         <v-radio-group v-model="params.active" row>
            <v-radio v-for="(item, index) in active_options" :key="index"
            :label="item.text" :value="item.value" 
            @change="onActiveChanged"
            />
         </v-radio-group>
      </v-flex>
      <v-flex xs12 sm4 md4>
         
      </v-flex>
      <v-flex xs12 sm4 md4 text-xs-right>
         <v-tooltip top content-class="top">
            <v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
               <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span>新增</span>
         </v-tooltip>
      </v-flex>
   </v-layout>
</template>

<script>
export default {
   name: 'RecruitsHeader',
   props: {
		params: {
			type: Object,
			default: null
      },
      active_options: {
			type: Array,
			default: null
      },
		can_create: {
			type: Boolean,
			default: false
		}
   },
   data () {
		return {
			
			
		}
   },
   beforeMount(){
		
   },
   methods: {
      create() {
         this.$emit('create');
      },
      onActiveChanged(val) {
			this.params.active = val;
			this.$emit('params-changed');
      }
   }
}
</script>

<style>

</style>