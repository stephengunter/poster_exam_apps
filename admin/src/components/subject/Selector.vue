<template>
<div>
   <v-layout row wrap>
      <v-flex xs12 sm6 md6>
         <a href="#" @click.prevent="launchSelect"> {{ title }}：{{ selected.fullText }}</a>
      </v-flex>
      <slot>

      </slot>
   </v-layout>

   <v-dialog v-model="select.active" :max-width="select.maxWidth">
      <v-card>
         <v-card-title>
            <span class="headline">選擇{{ title }}</span>
            <v-spacer />
            <a href="#" @click.prevent="closeSelect">
               <v-icon>mdi-window-close</v-icon>
            </a>
         </v-card-title>
         <v-card-text>
            <v-container>
               <core-category-selector ref="categorySelector" :title="title"
               :all_items="subjectList" :selected_id="selected.id"
               @select-changed="onSelected"
               />
            </v-container>
         </v-card-text>
      </v-card>
   </v-dialog>
    
</div>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_SUBJECTS } from '@/store/actions.type';
import { onError } from '@/utils';
export default {
   name: 'SubjectSelector',
   props: {
      title: {
         type: String,
         default: '科目'
      },
      selected_id: {
         type: Number,
         default: 0
      }
   },
	data () {
		return {
         modes: [],

         subjectList: [],

         select: {
            active: false,
            maxWidth: 480
         },

         selected: {
            id: 0,
            item: null,
            fullText: ''
         }
		}
   },
   beforeMount() {

      this.selected.id = this.selected_id;

      this.$store.dispatch(FETCH_SUBJECTS)
		.then(subjects => {
         this.subjectList = subjects;
         setTimeout(() => {
				this.init();
			}, 500)
         
		})
		.catch(error => {
			onError(error);
      })
      
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
   },
	methods: {
      init(){
         this.$refs.categorySelector.init();
      },
      launchSelect() {
         if(this.contentMaxWidth) this.select.maxWidth = this.contentMaxWidth;
         this.select.active = true;
      },
      closeSelect() {
         this.select.active = false;
      },
      onSelected(item) {
         this.setSelectedItem(item);
         this.submit();

         this.closeSelect();
      },
      setSelectedItem(item) {
			this.selected.id = item.id;
			this.selected.item = { ...item };
			this.selected.fullText = this.$refs.categorySelector.getSelectedListText();
      },
      submit(){
         this.$emit('submit', this.selected);
      }
      
	}
}
</script>