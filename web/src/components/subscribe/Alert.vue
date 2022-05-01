<template>
   <v-alert prominent border="right" colored-border type="info" elevation="2">
      <v-row align="center">
         <v-col class="grow">
            您目前還不是訂閱會員
         </v-col>
         <v-col class="shrink" v-if="can_create">
            <v-btn @click.prevent="onSubmit" color="primary" large outlined>立即訂閱</v-btn>
         </v-col>
      </v-row>
   </v-alert>
</template>

<script>
export default {
   name: 'SubscribeAlert',
   props: {
      can_create: {
         type: Boolean,
         default: false
      }
   },
   methods: {
      onSubmit() {
         this.$emit('submit');
      }
   }
}
</script>