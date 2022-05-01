<template>
	<div v-if="responsive">
		<subject-selector ref="subjectSelector" title="科目"
		:subject_list="subjects"
		@selected="onSubjectSelected"
		/>
		<v-row v-if="indexMode">
			<v-col v-if="searching" cols="12">
				<core-search  :keyword="params.keyword"
				@submit="onKeywordSubmit"
				/>
			</v-col>
			<v-col v-else cols="12" class="text-right">
				<core-button-search tooltip="搜尋" class_name="mr-2" 
				@search="onSearch"
				/>
				<core-button-create class_name="ml-3" tooltip="新增" :disabled="!can_create"
				@create="create"
				/>
			</v-col>
		</v-row>
		<term-selector ref="termSelector" title="條文"
		:term_list="terms" :multi="!indexMode"
		@selected="onTermSelected" @changed="onTermChanged"
		/>
		<v-row>
			<v-col cols="12">
				<recruit-selector ref="recruitSelector" title="考古題"
				:recruit_list="recruits" :multi="!indexMode"
				@selected="onRecruitSelected" @changed="onRecruitChanged"
				/>
			</v-col>
		</v-row>
	</div>
	<div v-else>
		<subject-selector v-if="indexMode" ref="subjectSelector" title="科目"
		:subject_list="subjects"
		@selected="onSubjectSelected"
		>	
			<v-col v-if="searching" cols="6">
				<core-search  :keyword="params.keyword"
				@submit="onKeywordSubmit"
				/>
			</v-col>
			<v-col v-else cols="6" class="text-right">
				<core-button-search tooltip="搜尋" class_name="mr-2" 
				@search="onSearch"
				/>
				<core-button-create class="ml-3" tooltip="新增" :disabled="!can_create"
				@create="create"
				/>
			</v-col>
		</subject-selector>
		<subject-selector v-else ref="subjectSelector" title="科目"
		:subject_list="subjects"
		@selected="onSubjectSelected"
		/>
		<term-selector ref="termSelector" title="條文"
		:term_list="terms" :multi="!indexMode"
		@selected="onTermSelected" @changed="onTermChanged"
		>
			<v-row>
				<v-col cols="12">
					<recruit-selector ref="recruitSelector" title="考古題"
					:recruit_list="recruits" :multi="!indexMode"
					@selected="onRecruitSelected" @changed="onRecruitChanged"
					/>

				</v-col>
			</v-row>
		</term-selector>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { INDEX, EDIT } from '@/consts';
import { FETCH_TERMS } from '@/store/actions.type';
import { SET_TERMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, isYearRecruit } from '@/utils';

export default {
   name: 'QuestionHeader',
   props: {
		mode: {
			type: String,
			default: INDEX
      },
		can_create: {
			type: Boolean,
			default: false
		},
      init_params: {
			type: Object,
			default: null
		}
	},
   data () {
		return {
			terms: [],
			params: null,
			searching: false,
			references: {}
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth', 'responsive']),
		...mapState({
			subjects: state => state.questions.subjects,
			recruits: state => state.questions.recruits
		}),
		indexMode() {
			return this.mode === INDEX;
		},
		subjectSelector() {
			if(this.$refs.subjectSelector) return this.$refs.subjectSelector;
			else if (this.references.subjectSelector) return this.references.subjectSelector;
			return null;
		},
		termSelector() {
			if(this.$refs.termSelector) return this.$refs.termSelector;
			else if (this.references.termSelector) return this.references.termSelector;
			return null;
		},
		recruitSelector() {
			if(this.$refs.recruitSelector) return this.$refs.recruitSelector;
			else if (this.references.recruitSelector) return this.references.recruitSelector;
			return null;
		}
	},
	beforeMount() {
		if(this.indexMode) {
			this.params = {
				subject: this.init_params ? this.init_params.subject : 0,
				term: this.init_params ? this.init_params.term : 0,
				recruit: this.init_params ? this.init_params.recruit : 0,
				keyword: this.init_params ? this.init_params.keyword : ''
			};
			
		}else {
			this.params = {
				subject: this.init_params ? this.init_params.subject : 0,
				terms: this.init_params ? this.init_params.terms : [],
				recruits: this.init_params ? this.init_params.recruits : []
			};
		}
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		init() {
			this.subjectSelector.init(this.params.subject);
			if(!this.params.subject) {
				let subject = this.subjectSelector.category.models[0].items[0];
				this.onSubjectSelected(subject.id);
			}else {
				this.fetchTerms();
			}

			this.initRecruitSelector();
		},
		onSubjectSelected(id) {
			if(!id) return;
			if(id === this.params.subject) return;

			this.params.subject = id;

			this.subjectSelector.setSubject(id);
			this.subjectSelector.cancelSelect();
			
			this.fetchTerms();
		},
		fetchTerms() {
			this.$store.dispatch(FETCH_TERMS, { subject: this.params.subject, parent: -1 })
			.then(terms => {
				this.terms = terms;
				this.$nextTick(() => {
					if(this.indexMode) this.onParamsChanged();
					setTimeout(() => {
						this.initTermSelector();
					}, 500);
				})
			})
			.catch(error => {
				onError(error);
			})
		},
		initTermSelector() {
			if(this.indexMode) {
				if(this.params.term > 0) {
					let term = this.terms.find(x => x.id === this.params.term);
					if(term) this.termSelector.init([this.params.term]);
					else {
						this.params.term = 0;
						this.termSelector.init();
					}
				}else this.termSelector.init();
			}else {
				if(this.params.terms.length) {
					for(let i = 0; i < this.params.terms.length; i++) {
						let term = this.terms.find(x => x.id === this.params.terms[i]);
						if(!term) this.params.terms.splice(i, 1);
					}
					this.termSelector.init(this.params.terms);
				}else this.termSelector.init();
			}
		},
		onTermSelected(id) {
			if(this.indexMode) {
				if(id === this.params.term) return;
				this.params.term = id;
			}else {
				if(this.params.terms.indexOf(id) > -1) return;
				this.params.terms.push(id);
			}
			
			this.onParamsChanged();

			this.termSelector.setTerm(id);
			this.termSelector.cancelSelect();
		},
		onTermChanged(ids) {
			if(this.indexMode) {
				this.params.term = ids[0];
			}else {
				this.params.terms = ids.slice(0);
			}
			
			this.onParamsChanged();
		},
		getSelectedTerms() {
			return this.termSelector.selected;
		},
		initRecruitSelector() {
			if(this.indexMode) {
				if(this.params.recruit > 0) {
					let recruit = this.recruits.find(x => x.id === this.params.recruit);
					if(recruit) this.recruitSelector.init([this.params.recruit]);
					else {
						this.params.recruit = 0;
						this.recruitSelector.init();
					}
				}else this.recruitSelector.init();
			}else {
				if(this.params.recruits.length) {
					for(let i = 0; i < this.params.recruits.length; i++) {
						let recruit = this.recruits.find(x => x.id === this.params.recruits[i]);
						if(!recruit) this.params.recruits.splice(i, 1);
					}
					this.recruitSelector.init(this.params.recruits);
				}else this.recruitSelector.init();
			}
		},
		onRecruitSelected(id) {
			if(this.indexMode) {
				if(id === this.params.recruit) return;
				this.params.recruit = id;
			}else {
				if(this.params.recruits.indexOf(id) > -1) return;
				this.params.recruits.push(id);
			}
			
			this.onParamsChanged();

			this.recruitSelector.setRecruit(id);
			this.recruitSelector.cancelSelect();
		},
		onRecruitChanged(ids) {
			if(this.indexMode) {
				this.params.recruit = ids[0];
			}else {
				this.params.recruits = ids.slice(0);
			}
			
			this.onParamsChanged();
		},
		getSelectedRecruits() {
			return this.recruitSelector.selected;
		},
		onParamsChanged() {
			this.$emit('params-changed', this.params);
		},
		onSearch() {
			this.searching = true;
		},
		onKeywordSubmit(val) {
			if(!val) this.searching = false;

			if(val === this.params.keyword) return;

			this.params.keyword = val;
         this.onParamsChanged();
		},
		create() {
			this.$emit('create');
		}
   }
}
</script>