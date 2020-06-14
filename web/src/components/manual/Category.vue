<template>
   <v-card>
      <core-close-icon-button v-if="allow_cancel" @close="cancel" />
      <v-card-title>
         <h3>{{ title }}</h3>
      </v-card-title>
      <v-card-text>
			<v-row>
            <v-col cols="12">
               <v-treeview :items="items" item-children="subItems"
               activatable hoverable return-object  active-class="primary--text"
               :active.sync="active"
               >
                  <template v-slot:label="{ item }">
                     <span style="font-size: 16px;">
                        {{ item.title }}
                     </span>
                  </template>
               </v-treeview>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData } from '@/utils';

export default {
   name: 'ManualCategory',
   props: {
      allow_cancel: {
         type: Boolean,
         default: true
      },
      params: {
         type: Object,
         default: null
      },
      items: {
			type: Array,
         default: null
      },
   },
   data() {
		return {
         active: []
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      title() {
         return '使用說明 - 目錄';
      },
      selectItem() {
			if(this.active.length) return this.active[0];
			return null;
		},
		treeMaxWidth() {
			return this.contentMaxWidth - 65;
      },
      canSearch() {
         return this.params.subject > 0;
      }
   },
   watch: {
      selectItem: 'onSelectItemChanged'
   },
	methods: {
      cancel() {
         this.$emit('cancel');
      },
      onSelectItemChanged(item) {
         if(item) this.$emit('selected', item);
      },
      onParamsChanged() {
         this.errText = '';
      },
      submit() {
         if(this.params.term) {
            this.$emit('submit', this.params);
         }else {
            if(this.params.subject) {
               if(this.params.keyword) {
                  this.params.term = 0;
                  this.params.mode = 0;
                  this.$emit('submit', this.params);
               }else if(this.selectItem.subItems.length < 1) {
                  this.$emit('submit', this.params);
               }
               else this.errText = '請選擇章節';
            }            
            else this.errText = '請選擇章節';
         }
         
      }
	}
}
</script>

<style>

</style>