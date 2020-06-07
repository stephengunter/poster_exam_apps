<template>
   <v-card-title v-if="responsive" class="indigo white--text headline">
      <v-layout wrap>
         <v-flex xs12>
            <v-icon color="white" class="mr-1">mdi-folder-open
            </v-icon> {{ selected_path }}
         </v-flex>
         <v-flex xs12>
            <v-tooltip top content-class="top">
               <v-btn @click.prevent="newFolder" fab small color="info" slot="activator">
                  <v-icon>mdi-plus</v-icon>
               </v-btn>
               <span>新增資料夾</span>
            </v-tooltip>
            <v-tooltip top content-class="top">
               <v-btn fab small color="success" slot="activator">
                  <v-icon>mdi-cloud-upload</v-icon>
               </v-btn>
               <span>上傳圖片</span>
            </v-tooltip>
         </v-flex>
      </v-layout>
   </v-card-title>
   <v-card-title v-else class="indigo white--text headline">
      <v-icon color="white" class="mr-1  mt-1">mdi-folder-open
      </v-icon> {{ selected_path }}
      
      <v-spacer />
      <v-tooltip top content-class="top">
         <v-btn @click.prevent="newFolder" fab small color="info" slot="activator">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <span>新增資料夾</span>
      </v-tooltip>
      <v-tooltip top content-class="top">
         <v-btn fab small color="success" slot="activator">
            <v-icon>mdi-cloud-upload</v-icon>
         </v-btn>
         <span>上傳圖片</span>
      </v-tooltip>
   </v-card-title>
</template>

<script>
export default {
   name: 'FileSelectorHeader',
   props: {
      responsive: {
         type: Boolean,
         default: false
      },
      selected_path: {
         type: String,
         default: ''
      },
   },
   data () {
      return {
         
      }
   },
   methods: {
      newFolder() {
         this.$emit('new-folder');
      }
   }
}
</script>

<style>

</style>