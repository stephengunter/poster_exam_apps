<template>
   <a @click.prevent="close" style="margin:5px" :color="color" class="close-icon-btn" >
      <v-icon>mdi-close-circle-outline</v-icon>
   </a>
</template>

<script>
export default {
   props: {
      color: {
         type: String,
         default: ''
      }
   },
   methods: {
      close() {
         this.$emit('close');
      }
   }
}
</script>

<style scoped>
  .close-icon-btn {
     margin : 0; 
     position : absolute;
     top : 0;
     right:0;
  }
</style>