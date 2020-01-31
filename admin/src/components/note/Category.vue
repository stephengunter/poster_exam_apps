<template>
   <v-card>
      <v-card-title>
         <h3>目錄</h3>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs6 sm6 md6>
               <v-select label="科目"
                  :items="subject.options" v-model="params.subject"
                  @change="onSubjectChanged"
               />
            </v-flex>
            <v-flex xs6 sm6 md6>
            </v-flex>
         </v-layout>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

const fetchTerms = (subjectIds, vm) => {
   let subjectId  = subjectIds.shift();
   setTimeout(() => {
      vm.$store.dispatch(FETCH_TERMS, { subject: subjectId, parent: 0 })
      .then(terms => {
         vm.loadTerms(subjectId, terms);

         if(subjectIds.length) fetchTerms(subjectIds, vm);
         else vm.onTermsFetched();              	
      })
      .catch(error => {
         onError(error);
      })
   }, 250);
}

export default {
   props: {
      subject_list: {
         type: Array,
			default: null
      },
      params: {
			type: Object,
			default: null
		}
   },
   data () {
      return {
         subject: {
				options: [],
				root: null,
				subItems: []
			},
      }
   },
   beforeMount(){
		this.init();
   },
   methods: {
      init() {
         console.log('init');
         let subjectOptions = this.subject_list.map(item => ({
				value: item.id, text: item.title
         }));

         this.subject.options = subjectOptions;
         
         if(!this.params.subject) this.params.subject = subjectOptions[0].value;
			this.onSubjectChanged(this.params.subject);
      },
      onSubjectChanged(val) {
			this.subject.root = this.subject_list.find(item => item.id === val);
		
         this.subject.subItems = this.subject.subItems.slice(0);
         
			let vm = this;
			fetchTerms(this.subject.subItems.map(item => item.id), vm);
      },
      loadTerms(subjectId, terms) {
			let subject = this.subject.subItems.find(item => item.id === subjectId);
			subject.terms = terms;
      },
      onTermsFetched() {
			console.log('onTermsFetched');
      },
      cancel() {

      }
   }
}
</script>

<style>

</style>