<template>
   <tr v-if="hasSources">
      <td>
          
      </td>
      <td style="padding: 10px 16px;">
         <source-item v-for="(item, index) in model.sources"  :key="index"
         :model="item" :index="index"
         />
      </td>
      <td>
         
      </td>
      <td>
         <ul>
            <li v-for="(item, index) in model.sources"  :key="index">
               {{ getItemText(item) }}
            </li>
         </ul>
         
      </td>
      <td v-if="enable">
        
         <v-btn @click.prevent="select" small icon color="success">
            <v-icon>mdi-pencil</v-icon>
         </v-btn>

         <v-btn @click.prevent="remove" small icon color="error">
            <v-icon>mdi-delete-circle</v-icon>
         </v-btn>
      </td>
      <td v-else>
         
      </td>
   </tr>
   <tr v-else>
      <td style="padding: 10px 16px;">
         <div v-for="(item, index) in model.attachments" :key="index" class="text-center">
            <v-img :src="item.previewPath | photoNameUrl(100)" class="img-center"
            max-width="100" aspect-ratio="1"
            />
            <span v-text="item.title" style="font-size: 16px; display: inline-block;"></span>
         </div>
      </td>
      <td>
         <core-highlight :queries="model.highlights" :content="model.text" />
      </td>
      <td>
         <core-label v-for="(item, index) in model.highlights" :key="index">
           {{ item }}
         </core-label>
      </td>
      <td>
         <ul>
            <li v-for="(item, index) in model.sources"  :key="index">
               {{ item.type }} {{ item.id }} 
            </li>
         </ul>
         
      </td>
      <td v-if="enable">
        
         <v-btn @click.prevent="select" small icon color="success">
            <v-icon>mdi-pencil</v-icon>
         </v-btn>

         <v-btn @click.prevent="remove" small icon color="error">
            <v-icon>mdi-delete-circle</v-icon>
         </v-btn>
      </td>
      <td v-else>
         
      </td>
   </tr>
  
</template>

<script>
import { photoNameUrl, replaceBR } from '@/utils';
export default {
   name: 'ResolveRowRead',
   props: {
      question: {
         type: Object,
         default: null
		},
      index: {
         type: Number,
         default: 0
      },
      model: {
         type: Object,
         default: null
      },
      edit: {
         type: Boolean,
         default: false
      },
      enable: {
         type: Boolean,
         default: false
      }
   },
   data () {
		return {
         
		}
   },
   computed: {
      hasSources() {
         if(!this.model) return false;
         return this.model.sources.length > 0;
      }
   },
   methods: {
      select() {
         this.$emit('selected');
      },
      remove() {
         this.$emit('remove');
      },
      getItemText(item) {
         if(item.noteId) return `Note ${item.noteId}`;
         else return `Term ${item.termId}`;
      }
   }
}
</script>