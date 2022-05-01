<template>
   <li>
      <v-badge v-if="model.totalQuestions" color="primary" style="margin:8px">
         <template v-slot:badge>
            <span>{{ model.totalQuestions }}</span>
         </template>
         <span>{{ model.term.chapterTitle ? model.term.fullText : model.term.title }}</span>
      </v-badge>
      <span v-else  style="margin:8px">{{ model.term.chapterTitle ? model.term.fullText : model.term.title }}</span>
      <ul v-if="subItems.length" v-show="subject_type === 'first'">
         <li v-for="(subItem, index) in subItems" :key="index">
            <v-badge color="info" style="margin:8px">
               <template v-slot:badge>
                  <span v-text="subItem.questions"></span>
               </template>
               <span> {{ subItem.term.fullText }}</span>
            </v-badge>
         </li>
      </ul>
   </li>
</template>

<script>
export default {
   props: {
      model: {
         type: Object,
         default: null
      },
      subject_type: {
         type: String,
         default: ''
      }
   },
   computed: {
		subItems() {
         if(!this.model) return [];
         return this.model.subItems.filter(item => item.questions > 0);
      },
	}
}
</script>