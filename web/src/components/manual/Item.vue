<template>
   <v-card>
      <v-card-title>
         <h3>{{ model.title }}</h3>
      </v-card-title>
      <v-card-text style="font-size: 1rem;">
         <v-row v-if="model.summary">
            <v-col>
               <p v-html="model.summary">
                  
               </p>
            </v-col>
         </v-row>
         <v-row v-if="model.content">
            <v-col>
               <p v-html="model.content">
                  
               </p>
            </v-col>
         </v-row>
         <!-- <v-row v-if="model.subItems && model.subItems.length">
            <v-col>
               <span class="font-weight-thin">功能</span>
               <p>
                  <ul>
                     <li v-for="(subItem, index) in model.subItems" :key="index">
                        {{ subItem.title }}
                     </li>
                  </ul>
               </p>
            </v-col>
         </v-row> -->
         <v-row v-for="item in model.features" :key="item.key">
            <v-col cols="12">
               <h3>
                  {{ item.title }}
               </h3>
               <div v-if="item.summary" class="mt-3" v-html="item.summary">
                  
               </div>
            </v-col>
            <v-col cols="12">
               <div v-html="item.content">
                  
               </div>
            </v-col>
         </v-row>
         <manual-item v-for="(subItem, index) in model.subItems" :key="index"
         :model="subItem"
         />
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'ManualItem',
   props: {
      model: {
         type: Object,
         default: null
      }
   }
}
</script>

<style>

</style>