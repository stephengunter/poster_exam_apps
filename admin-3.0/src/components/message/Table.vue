<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0"
   >
      <template v-slot:item.action="{ item }">
         <v-btn @click.prevent="edit(item.id)" icon color="success">
            <v-icon small>mdi-pencil</v-icon>
         </v-btn>
      </template>
      <template v-slot:item.status="{ item }">
         <v-chip small v-if="item.returned" color="success" text-color="white">已回覆</v-chip>
         <v-chip small v-else>未回覆</v-chip>
      </template>
  </v-data-table>
</template>

<script>
export default {
   name: 'MessageTable',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   data() {
      return {
         headers: [{
            text: '', value: 'action', sortable: false, width: '30px'
         },{
            text: '狀態', value: 'status', sortable: false, width: '60px'
         },{
            text: '日期', value: 'createdAtText', sortable: false, width: '120px'
         },{
            text: 'Email', value: 'email', sortable: false, width: '240px'
         },{
            text: '主旨', value: 'subject', sortable: false
         },{
            text: '內容', value: 'content', sortable: false
         }]
      }
   },
   methods: {
      edit(id){
         this.$emit('edit', id);
      },
      select(item) {
         this.$emit('select', item)
      }
   }
}
</script>

<style>

</style>