<template>
   <v-card>
      <v-card-title :class="style" primary-title>
         <v-icon v-if="isWarning" color="white" class="mr-3">
            mdi-alert-circle
         </v-icon>
         <span class="cn" :style="titleStyle">
            {{ title }}
         </span>
      </v-card-title>

      <v-card-text>
         {{ msg }}
      </v-card-text>

      <v-divider v-if="msg"></v-divider>

      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn color="blue darken-1" flat @click="cancel">
            <span class="cn">No</span>
         </v-btn>
         <v-btn color="primary" flat @click="accept">
            <span class="cn">Yes</span>
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'Confirm',
   props: {
		type: {
         type: String,
         default: 'warning'
      },
      title: {
         type: String,
         default: '確定要刪除嗎?'
      },
      msg: {
         type: String,
         default: ''
      },
   },
   data () {
		return {
         show: false
      }
   },

   computed: {
      isWarning(){
         return this.type === 'warning';
      },
		style(){
         let basic = 'headline lighten-1';
         let color = 'red';
         return `${basic} ${color}`;
      },
      icon(){
         return 'mdi-alert-circle';
      },
      titleStyle(){
         if(this.isWarning) return 'color: #fff;';  
         
      }
   },
   methods: {
		accept(){
			this.$emit('ok');
      },
      cancel(){
         this.$emit('cancel');
      }
   }
   
}
</script>

