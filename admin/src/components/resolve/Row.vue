<template>
   <resolve-row-edit v-if="edit"
   :question="question" :index="index"
   :model="model" :enable="enable"
   @save="save" @cancel="cancel" 
   />
   <resolve-row-read v-else
   :question="question" :index="index"
   :model="model" :enable="enable"
   @selected="select" @remove="remove"
   />
</template>

<script>
import { photoNameUrl, replaceBR } from '@/utils';
export default {
   name: 'ResolveRow',
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
   methods: {
      select() {
         this.$emit('selected', this.index, this.model);
         if(this.model.text) this.model.text = replaceBR(this.model.text);
         this.model.medias = [];
      },
      cancel() {
         this.$emit('cancel');
      },
      save() {
         this.$emit('save');
      },
      remove() {
         this.$emit('remove', this.index);
      }
   }
}
</script>

