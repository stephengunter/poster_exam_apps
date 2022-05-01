<template>
   <div>
      <v-subheader>
         <v-icon v-text="page.icon">mdi-home</v-icon>
         <span class="ml-2" style="font-size:1.4em;font-weight:bold">{{ page.title }}</span>
      </v-subheader>
      <v-list-item v-for="(item, index) in page.items" :key="index" @click="select(item.id)">
         <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
         </v-list-item-content>
         <v-list-item-icon>
            <v-chip v-if="item.free" color="success" small>
            免費
            </v-chip>
            <v-chip v-else color="warning" small>
            訂閱會員
            </v-chip>
         </v-list-item-icon>
      </v-list-item>
      <v-divider v-if="divider"></v-divider>
   </div>
</template>

<script>
export default {
   name: 'IntroUtilList',
   props: {
      page: {
			type: Object,
			default: null
      },
      divider: {
			type: Boolean,
			default: false
      },
   },
   methods: {
      select(id) {
         this.$emit('selected', id);
      }
   }
}
</script>

<style>

</style>