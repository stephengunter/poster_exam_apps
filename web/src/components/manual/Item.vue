<template>
   <v-card v-if="model">
      <v-card-title>
         <h3>{{ model.title }}</h3>
         <v-chip v-if="model.isRoot" :color="model.free ? 'success' : 'warning'" class="ml-3" small>
            {{ model.free ? '免費' : '訂閱會員'  }}
         </v-chip>
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
         <feature-item v-for="(item, index) in model.features" :key="index" 
         :item="item"
         />
         <manual-item v-for="subItem in model.subItems" :key="subItem.id"
         :item="subItem" class="mt-3"
         />
      </v-card-text>
   </v-card>
</template>

<script>
import { convertHtmlContent } from '@/utils';
export default {
   name: 'ManualItem',
   props: {
      item: {
         type: Object,
         default: null
      }
   },
   data() {
		return {
			model: null
		}
	},
   watch: {
      item:{
         handler() {
            this.init();
         },
         deep: true
      }
   },
   beforeMount() {
      this.init();
	},
   methods: {
		init() {
         if(!this.item) return;
        
         this.model = {
            ...this.item,
            summary: convertHtmlContent(this.item.summary),
            content: convertHtmlContent(this.item.content),
         };
		}
	}
}
</script>