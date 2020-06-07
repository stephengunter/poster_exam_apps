<template>
   <v-row dense class="mb-2">
		<v-col cols="12">
         <ul>
            <li v-for="(item, index) in breadItems" :key="index">
               <router-link :to="item.path" class="a-btn" v-text="item.text">
               </router-link>
               <v-icon v-if="index < breadItems.length - 1" class="pb-1 ml-1 mr-1" size="16">
                  mdi-chevron-right
               </v-icon>
            </li>
         </ul>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
   name: 'Bread',
   computed: {
      ...mapGetters(['currentPage']),
      breadItems() {
         let page = this.currentPage;
         if(page) {
            if(page.parentPage) {
               return [{ 
                  path: page.parentPage.path, text: page.parentPage.meta.title 
               },{
                  path: page.path, text: page.meta.title 
               }];
            }else {
               return [{ path: page.path, text: page.meta.title }];
            }
         }
         return [];
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