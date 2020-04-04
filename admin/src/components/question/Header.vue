<template>
<div>
	<subject-selector ref="subjectSelector"
	:selected_id="subject.id"
	@submit="onSubjectSelected"
	>
		<v-flex v-show="searching" xs12 sm6 md6 text-xs-right>
			<core-search
			@submit="search" @clear="clearSearch"
			/>
		</v-flex>
		<v-flex v-show="!searching"  xs12 sm6 md6 text-xs-right>
			<v-btn @click.prevent="searching = true" class="mx-2" fab small>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
			<v-btn v-if="allow_create" :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-flex>
	</subject-selector>
	<term-selector ref="termSelector" :multi="multi_terms"
	:subject_id="params.subject" :selected_ids="term.ids"
	@submit="onTermSelected"
	>
		<v-flex xs12 sm6 md6>
			<recruit-selector ref="recruitSelector"
			:selected_ids="recruit.ids" :multi="multi_recruits"
			:recruits="recruitList" :subject="subject.model"
			@submit="onRecruitSelected"
			/>
   	</v-flex>
	</term-selector>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_RECRUITS } from '@/store/actions.type';
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
		multi_recruits: {
			type: Boolean,
			default: true
      },
      params: {
			type: Object,
			default: null
		}
	},
   data () {
		return {
			searching: false,

			recruitList: [],

			subject: {
				id: 0,
				model: null
			},

			selectedSubject: null,

			term: {
				ids: [],
				terms:[],
				changes: 0
			},
			recruit: {
				ids: [],
				recruits: [],
				changes: 0
			}
			
			
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
   },
   beforeMount(){		
		this.$store.dispatch(FETCH_RECRUITS, { parent: 0, active: -1 })
		.then(recruits => {
			this.recruitList = recruits;
		})
		.catch(error => {
			onError(error);
		})

		this.init();
   },
   methods: {
		init() {
			this.subject.id = this.params.subject;

			if(this.multi_terms) {
				//複選
				let idsText = this.params.terms;
				if(idsText) this.term.ids = idsText.split(',').map(id => parseInt(id));

			}else {
				if(this.params.term) this.term.ids = [this.params.term];
			}

			let selectedIds = [];
			if(this.params.recruits) {
				selectedIds = this.params.recruits.split(',').map(id => parseInt(id));
			}
			this.recruit.ids = selectedIds;
		},
		onSearching() {
			this.$emit('search');
		},
		search(keyword) {
			this.params.keyword = keyword;
			this.$emit('params-changed');
		},
		clearSearch() {
			this.searching = false;
			this.params.keyword = '';
			this.$emit('params-changed');
      },
      create() {
			this.$emit('create');
      },
      onSubjectSelected({ id, item, fullText }) {
			this.params.subject = id;
			this.subject.model = { ... item };

			this.$nextTick(() => {
				this.initTerms();
				this.initRecruits();
			});
			
		},
		initTerms() {
			this.$refs.termSelector.init();
		},
		onTermSelected({ terms, textList, ids, idsText }) {
			this.term.changes += 1;
			this.term.ids = ids;
			this.term.terms = terms;

			if(this.multi_terms) {
				//複選
				this.setParams('terms', idsText);

			}else {
				if(ids && ids[0]) this.setParams('term', ids[0]);
				else this.setParams('term', 0);
			}
			
		},
		initRecruits() {
			this.$refs.recruitSelector.init();
		},
		setParams(key, val) {
			this.params[key] = val;

			if(this.recruit.changes && this.term.changes) {
				this.$emit('params-changed');
			}
		},
		onRecruitSelected({ recruits, ids, idsText }) {
			this.recruit.ids = ids;
			this.recruit.recruits = recruits;
			this.recruit.changes += 1;

			this.setParams('recruits', idsText);
		},
		//public getters
		getRecruit() {
			return this.recruit;
		},
		getTerm() {
			return this.term;
		},
		getSubject() {
			return this.subject;
		}
   }
}
</script>

<style>

</style>