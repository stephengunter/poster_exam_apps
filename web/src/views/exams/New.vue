<template>
   <v-container>
      <div class="mb-2">
			<core-bread @selected="onBreadSelected" />
      </div>
		<core-error-list v-if="hasErrors" />
		<div v-show="exam">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
			@aborted="onDeleted" @stored="onStored"
         /> 
      </div>
      
		<v-dialog v-model="creator.active" :max-width="creator.maxWidth" persistent>
			<exam-creator :init_params="params" :allow_cancel="canBack"
			:type_options="typeOptions" :recruit_type_options="rTypeOptions"
			:year_options="yearOptions" :subject_options="subjectOptions"
			:year_recruits="yearRecruits"
			@submit="onCreatorSubmit" @cancel="onCreatorCancel"
			/>
		</v-dialog>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { INIT_EXAMS, CREATE_EXAM, EXAM_RECORDS, EXAM_SUMMARY,
	LOAD_ACTIONS, ACTION_SELECTED, LEAVE_EXAM
} from '@/store/actions.type';
import { SET_BREAD_ITEMS, SET_LOADING, CLEAR_ERROR, SET_ERROR, 
	SET_EXAM_CREATE_PARAMS, SET_EXAM
} from '@/store/mutations.type';
import { onError, getRouteTitle, todayString } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'ExamNewView',
	data() {
		return {
			pageName: 'exam-new',
			title: '',

			canBack: false,
			references: {},

			params: {
				recruit: 0,
				type: -1,
				rtype: -1,
				subject: 0	
			},

			creator: {
				active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            model: null
         },
		}
	},
	computed: {
		...mapState({
			indexModel: state => state.exams.indexModel,
			createParams: state => state.exams.createParams,
			examActions: state => state.exams.actions
		}),
		...mapGetters(['exam', 'breadItems', 'errorList','contentMaxWidth']),
      typeOptions() {
         if(this.indexModel) return this.indexModel.examTypeOptions;
         return [];
      },
      rTypeOptions() {
         if(this.indexModel) return this.indexModel.recruitExamTypeOptions;
         return [];
      },
      subjectOptions() {
         if(this.indexModel) return this.indexModel.subjectOptions;
         return [];
      },
      yearRecruits() {
         if(this.indexModel) return this.indexModel.yearRecruits;
         return [];
      },
      yearOptions() {
         if(this.yearRecruits) {
            return this.yearRecruits.map(item => ({
               value: item.id, text: item.title
            }));
         }
         return [];
      },
		examEdit() {
			if(this.$refs.examEdit) return this.$refs.examEdit;
			else if (this.references.examEdit) return this.references.examEdit;
			return null;
		},
		hasErrors(){
         if(!this.errorList) return false; 
         return this.errorList.any();
      }
	},
	beforeRouteEnter(to, fromRoute, next) {
		next(vm => {
			vm.canBack = fromRoute && fromRoute.name === 'exams';
		});
	},
	beforeRouteLeave(to, from, next) {
      //檢查是否有未存檔的測驗
      this.examEdit.handleAction(LEAVE_EXAM, next);
   },
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	beforeMount() {
		let autoCreate = false;
		if(this.createParams && this.createParams.recruit) {
			this.params.recruit = this.createParams.recruit;
			autoCreate = true;

			this.$nextTick(() => {
				this.$store.commit(SET_EXAM_CREATE_PARAMS, null);
			});
		}

		if(this.indexModel) {
			if(autoCreate) this.createExam();
			else this.launchCreator();			
		}else {
			this.initExams(autoCreate);
		}

		this.pageName = this.$route.name;
		this.title = getRouteTitle(this.$route);
		let items = [{
			action: '', text: this.title
		},{
			action: '', text: '新測驗'
		}];
		this.$store.commit(SET_BREAD_ITEMS, items);
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   beforeDestroy() {
      this.$store.commit(SET_EXAM, null);
   },
	methods: {
		setTitle() {
			let items = [{
				action: EXAM_RECORDS, text: this.title
			}];

			if(this.exam) {
				items.push({
					action: EXAM_SUMMARY, text: this.exam.title ? this.exam.title : '無存檔名稱'
				});
			}
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		initExams(autoCreate) {
			this.$store.dispatch(INIT_EXAMS)
			.then(() => {
				this.$nextTick(() => {
					if(autoCreate) this.createExam();
					else this.launchCreator();
				})
			})
			.catch(error => {
				onError(error);
			})
		},
		launchCreator() {
         this.creator.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.creator.active = true;
		},
		onCreatorCancel() {
			this.creator.active = false;
			this.$store.commit(SET_LOADING, true);
			this.goExamsPage();
		},
		onCreatorSubmit(params, model) {
			this.params = { ...params };

         this.creator.model = model;
			this.creator.active = false;

			this.createExam(params);
		},
		createExam(params) {
			if(!params) params = this.params;

         this.$store.dispatch(CREATE_EXAM, params)
         .then(() => {
				this.$nextTick(() => {
					this.setTitle();
					this.examEdit.init();
					this.setActions();
				});
         })
			.catch(error => {
            if(error.status) {
					Bus.$emit('errors', error);
				}else {
					this.$store.commit(SET_ERROR, error);
				}
			})
		},
		setActions() {
			let blocks = [];
         blocks.push([EXAM_RECORDS, EXAM_SUMMARY]);
			blocks.push(this.examActions.map(item => item.name));

			this.$store.dispatch(LOAD_ACTIONS, blocks);
		},
		onBreadSelected(item) {
			this.onActionSelected(item.action);
		},
		onActionSelected(name) {
			if(this.$route.name !== this.pageName) return;
			
			if(name === EXAM_RECORDS) this.goExamsPage();
			else this.examEdit.handleAction(name);
		},
		onDeleted() {
			this.goExamsPage();
		},
		onStored(id) {
			//交券完成
			this.$router.push({ path: `/exams/${id}` });
		},
		goExamsPage() {
			if(this.canBack && window.history.length) this.$router.go(-1);
			else this.$router.push({ name: 'exams' });
		}
   }
}
</script>

<style>

</style>