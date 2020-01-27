<template>
   <ul :class="class_name">
      <li v-for="(item, index) in items" :key="index">
         <a href="#" @click.prevent="selected(item)">
            {{ item.text }}
         </a>
         <v-icon v-if="index < items.length - 1" class="pb-1 mr-1" size="16">
            mdi-chevron-right
         </v-icon>
      </li>
   </ul>
</template>

<script>
export default {
   name: 'Bread',
   props: {
      items : {
         type: Array,
         default: null
      },
      class_name : {
         type: String,
         default: ''
      }
   },
   methods: {
      selected(item) {
         this.$emit('selected', item);
      }
   }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

li {
  float: left;
}

li a {
  text-decoration: none;
}
</style>