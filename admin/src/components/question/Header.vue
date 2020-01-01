<template>
<div>
   <v-layout row>
      <v-flex xs12 sm6 md6>
         <a href="#" @click.prevent="selectSubject"> {{ subject.title }}： {{ subject.fullText }} </a>
      </v-flex>
      <v-flex v-if="allow_create" xs12 sm6 md6 text-xs-right>
			<v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
      </v-flex>
		<v-flex v-else xs12 sm6 md6 text-xs-right>
         
      </v-flex>
   </v-layout>
   <v-layout row>
		<v-flex v-if="multi_terms" xs12 sm6 md6>
			<v-layout row  v-for="(item, index) in term.models" :key="index" >
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="selectTerm(index)"> 
						{{ term.title }}： {{ term.fullTextList[index] }} 
					</a>
					<a class="ml-3" href="#" @click.prevent="removeTerm(index)">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-flex> 
			</v-layout>
			<v-layout row>
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="selectTerm(-1)">
						{{ term.title }}：
					</a>
				</v-flex> 
			</v-layout>
		</v-flex>
      <v-flex v-else xs12 sm6 md6>
			 <a href="#" class="text-truncate" @click.prevent="selectTerm"> {{ term.title }}： {{ term.fullText }} </a>
      </v-flex>
      <v-flex xs12 sm6 md6>
			<a href="#" @click.prevent="selectRecruits"> 考古題： {{ this.recruits.fullText }}</a>
   	</v-flex>
   </v-layout>
   <v-dialog v-model="subject.selecting" :max-width="subject.maxWidth">
      <v-card>
         <v-card-text>
            <v-container>
               <core-category-selector ref="subjectSelector" :title="subject.title"
               :all_items="subjectList" :selected_id="params.subject"
               @select-changed="onSubjectSelected"
               />
            </v-container>
         </v-card-text>
      </v-card>
   </v-dialog>
   <v-dialog v-model="term.selecting" :max-width="term.maxWidth">
      <v-card>
         <v-card-title>
            <span class="headline">{{ '選擇' + term.title }}</span>
            <v-spacer />
            <a href="#" @click.prevent="term.selecting = false">
               <v-icon>mdi-window-close</v-icon>
            </a>
         </v-card-title>
         <v-card-text>
            <v-container>
               <core-category-selector ref="termSelector" :title="term.title"
               :all_items="termList" :selected_id="params.term"
               @select-changed="onTermSelected"
               />
               <v-layout v-if="term.model" row wrap>
                  <v-flex sm12>
                     <div v-html="term.model.fullText">

                     </div>
                     
                  </v-flex>
               </v-layout>
            </v-container>
            
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn @click.prevent="onSubmitTerm" color="primary">確定</v-btn>
            
         </v-card-actions>
      </v-card>
   </v-dialog>
	<v-dialog v-model="recruits.selecting" :max-width="recruits.maxWidth">
      <v-card v-if="recruits.selecting">
         <v-card-title>
            <span class="headline">{{ '選擇' + recruits.title }}</span>
            <v-spacer />
            <a href="#" @click.prevent="recruits.selecting = false">
               <v-icon>mdi-window-close</v-icon>
            </a>
         </v-card-title>
         <v-card-text>
            <v-container>
               <v-layout row wrap>
                  <v-flex xs6 sm4 md4 v-for="item in recruitOptions" :key="item.value">
                     <v-checkbox @change="onRecruitChanged(item.value)"
							:label="item.text" :value="item.value" 
							v-model="recruits.ids"
							/>
                  </v-flex>
               </v-layout>
            </v-container>
            
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn @click.prevent="onSubmitRecruits" color="primary">確定</v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_SUBJECTS, FETCH_RECRUITS, FETCH_TERMS } from '@/store/actions.type';
import { hasIntersection, onError } from '@/utils';

export default {
   name: 'QuestionHeader',
   props: {
		allow_create: {
			type: Boolean,
			default: true
      },
		can_create: {
			type: Boolean,
			default: false
		},
		multi_terms: {
			type: Boolean,
			default: false
      },
      params: {
			type: Object,
			default: null
		}
	},
   data () {
		return {
			
			subjectList: [],
			termList: [],

			recruitList:[],
			recruitOptions: [],

			subject: {
				title: '科目',
				model: null,
				selecting: false,
				maxWidth: 800,
				fullText: ''
			},
			term: {
				title: '條文',
				id: 0,
				selecting: false,
				selectingIndex: 0,
				maxWidth: 800,
				fullText: '',
				model: null,
				models: [],
				fullTextList: []
			},
			recruits: {
				title: '考古題',
				ids: [],
				selecting: false,
				maxWidth: 800,
				fullText: '',
			}
			
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
   },
   beforeMount(){
		this.$store.dispatch(FETCH_SUBJECTS)
		.then(subjects => {
			this.subjectList = subjects;
			this.$store.commit(SET_LOADING, true);
			setTimeout(() => {
				this.$refs.subjectSelector.init();
			}, 500)
		})
		.catch(error => {
			onError(error);
		})
		

		this.$store.commit(CLEAR_ERROR);
		this.$store.dispatch(FETCH_RECRUITS)
		.then(recruits => {
			this.recruitList = recruits;

			if(this.params.recruits) {
				this.recruits.ids = this.params.recruits.split(',').map(id => parseInt(id));
			}else this.recruits.ids = [0];
		})
		.catch(error => {
			onError(error);
		})
		 
   },
   methods: {
      selectSubject() {
			if(this.contentMaxWidth) this.subject.maxWidth = this.contentMaxWidth;
			this.subject.selecting = true;
		},
		onSubjectSelected(item){
			this.$store.commit(SET_LOADING, false);
			let subjectId = 0;
			if(item) subjectId = item.id;
			if(!subjectId) return;

			this.setSelectedSubject(item);
			this.fetchTerms(subjectId);
			
			this.loadRecruitOptions();

			if(this.subject.selecting) this.subject.selecting = false;
		},
		setSelectedSubject(item) {
			this.params.subject = item.id;
			this.subject.model = item;
			this.subject.fullText = this.$refs.subjectSelector.getSelectedListText();
		},
		fetchTerms(subject){
			let parent = -1;
			let subItems = false;
			
			this.$store.dispatch(FETCH_TERMS, { subject, parent, subItems })
			.then(terms => {
				this.termList = terms;

				this.$store.commit(SET_LOADING, true);
				setTimeout(() => {
					this.$refs.termSelector.init();
				}, 500);
				
			})
			.catch(error => {
				onError(error);
			})
		},
		selectTerm(index = 0) {
			this.term.selectingIndex = index;

			if(this.contentMaxWidth) this.term.maxWidth = this.contentMaxWidth;
			this.term.selecting = true;

			if(this.multi_terms) {
				let selectedModel = this.term.models[index];
				if(selectedModel) this.params.term = selectedModel.id;
				setTimeout(() => {
					this.$refs.termSelector.init(false);
				}, 500);
			}
			
		},
		removeTerm(index) {
			this.setSelectedTerm(null, '', index);
			this.onSubmitTerm();
		},
		onTermSelected(item, fullText){
			this.$store.commit(SET_LOADING, false);

			let selectingIndex = this.term.selectingIndex;
			this.setSelectedTerm(item, fullText, selectingIndex);

			if(this.term.selecting) {
				
			}else {
				//初次自動載入
				if(this.multi_terms) {
					if(this.params.terms.length > selectingIndex + 1) {
						this.params.term = this.params.terms[selectingIndex + 1];
						setTimeout(() => {
							this.$refs.termSelector.init();
						}, 500);
						this.term.selectingIndex += 1;
					}
					
				}else {
					this.onSubmitTerm();
				}
			}
		},
		setSelectedTerm(item, fullText, selectingIndex) {
			if(selectingIndex < 0) {
				//新增
				if(!item) return;
				let existIndex = this.term.models.findIndex(x => x.id === item.id);
				if(existIndex >= 0) return;

				this.term.models.push(item);
				this.term.fullTextList.push(fullText);
			}else {
				if(item) {
					let existIndex = this.term.models.findIndex(x => x.id === item.id);
					if(existIndex >= 0) return;
					this.term.models.splice(selectingIndex, 1, item);
					this.term.fullTextList.splice(selectingIndex, 1, fullText);
				} 
				else {
					this.term.models.splice(selectingIndex, 1);
					this.term.fullTextList.splice(selectingIndex, 1);
				} 
			}
		},
		onSubmitTerm() {
			if(this.multi_terms) {
				let models = this.term.models;
				this.params.terms = models.map(item => item.id); 
			}else {
				this.params.term = 0;
				this.term.fullText = '';
				if(this.term.models.length) {
					let model = this.term.models[0];
					if(model) this.params.term = model.id;
					this.term.fullText = this.$refs.termSelector.getSelectedListText();
				}
			}
         
         this.$emit('params-changed');

			this.term.selecting = false;
			
		},
		selectRecruits() {
			this.loadRecruitOptions();

			if(this.contentMaxWidth) this.recruits.maxWidth = this.contentMaxWidth;
			this.recruits.selecting = true;
		},
		loadRecruitOptions () {
			let options = [{ value: 0, text: '-------' }];
			let subject = this.subject.model;
			if(!subject) {
				this.recruitOptions = options;
				return;
			} 

			let allRecruits = this.recruitList;
			let subjectIds = [subject.id].concat(subject.subIds);
			let recruitIds = [];
			for(let i = 0; i < allRecruits.length; i++) {
				let recruit = allRecruits[i];
				if(hasIntersection(subjectIds, recruit.subjectIds)) {
					recruit.subItems.forEach(item => {
						if(hasIntersection(subjectIds, item.subjectIds)){
							recruitIds.push(item.id);
							options.push({
								value: item.id, text: recruit.title
							});
						}
					});
				}
			}

			
			if(!hasIntersection(recruitIds, this.recruits.ids)) {
				this.recruits.ids = [0];
			}

			this.recruitOptions = options;
			this.onSubmitRecruits();
		},
		onSubmitRecruits() {
			let ids = this.recruits.ids;
			if(ids.includes(0)) this.params.recruits = '';
			else this.params.recruits = ids.join();

			let text = '';
         for(let i = 0; i < ids.length; i++) {
				if(ids[i] === 0) continue;
				if(i > 0) text += ' , ';
				
				let item =  this.recruitOptions.find(item => item.value === ids[i]);
				if(item) text += item.text;
			}

			this.recruits.fullText = text;

			if(this.recruits.selecting){
				this.$emit('params-changed');
				this.recruits.selecting = false;
			}
		},
		onRecruitChanged(val) {
			if(val) {
				//清除 0
				let idx = this.recruits.ids.findIndex(val => val === 0);
				if(idx >= 0) this.recruits.ids.splice(idx, 1);
			}else {
				this.recruits.ids = [0];
			}
		},
		getRecruitIds() {
			return this.recruits.ids;
		},
		getSelectedRecruits() {
			
			let ids = this.recruits.ids;
			if(ids.length) {
				let recruits = [];
				this.recruitList.forEach(item => {
					recruits = recruits.concat(item.subItems);
				});
				return recruits.filter(item => ids.includes(item.id));
			}else return [];
		},
      create(){
         this.$emit('create');
      }
   }
}
</script>

<style>

</style>