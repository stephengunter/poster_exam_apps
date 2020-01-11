<template>
   <ul class="options">
      <li v-for="(option,index) in options" :key="option.id" :class="{ 'option-display': index > 0, 'correct-option': option.correct }" >

         <div style="display:inline;"> 
            <v-icon v-if="option.correct" color="success">
            mdi-check-circle
            </v-icon>
            <a href="#" v-if="option.attachments.length" @click.prevent="showPhoto(option.attachments[0])">
               <img  style="vertical-align:middle" 
               :src="option.attachments[0].previewPath | photoNameUrl(50)"
               >
            </a>
            
            {{ option.title }}
         </div>
         
      </li>
   </ul>
</template>

<script>
export default {
   name: 'OptionList',
   props: {
      options: {
         type: Array,
         default: null
		}
   },
   methods: {
      showPhoto(photo){
         this.$emit('show-photo', photo);
      },
   }
}
</script>

<style scoped>
.options {
   padding-left : 0px;
   list-style-type : none;
}
.option-display {
   padding-top: 0.2em;
}
.correct-option {
   color:#1867c0;
   font-size : 1.6em; 
}
</style>