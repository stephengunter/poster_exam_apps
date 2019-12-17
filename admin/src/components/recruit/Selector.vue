<template>
   <v-card>
      <v-card-title>
         <span class="headline">請選擇年度</span>
         <v-spacer />
         <v-tooltip top content-class="top">
            <a href="#" @click.prevent="cancel" slot="activator">
               <v-icon>mdi-window-close</v-icon>
            </a>
            <span>取消</span>
         </v-tooltip>
      </v-card-title>
      <v-card-text>
          
         <v-layout  row wrap>
            <v-flex xs6 v-for="item in options" :key="item.value">
               <v-checkbox :label="item.text" v-model="selected" :value="item.value" />
            </v-flex>        
         </v-layout>
      </v-card-text>

      <v-card-actions>
         <v-spacer />
         <v-btn @click.prevent="onSubmit" color="primary">確定</v-btn>
      </v-card-actions>
   </v-card>		
</template>


<script>

export default {
	name: 'RecruitSelector',
	props: {
      model: {
         type: Array,
         default: null
      },
		options: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			selected: [],
		}
	},
	beforeMount(){
		this.selected = this.model.slice(0);
	},
	mounted(){
		
	},
	methods: {
		onSubmit(){
         this.$emit('submit', this.selected);
      },
      cancel(){
         this.$emit('cancel');
      }
	}
}
</script>
