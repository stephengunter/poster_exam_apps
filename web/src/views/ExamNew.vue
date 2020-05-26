<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
		<core-error-list v-if="hasErrors" />
		<div v-show="exam">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
			@aborted="onDeleted"
         /> 
      </div>
      
		<v-dialog v-model="creator.active" :max-width="creator.maxWidth" persistent>
			<exam-creator v-if="creator.active"  :init_params="params" :allow_cancel="false"
			:type_options="typeOptions" :recruit_type_options="rTypeOptions"
			:year_options="yearOptions" :subject_options="subjectOptions"
			:year_recruits="yearRecruits"
			@submit="onCreatorSubmit" @cancel="creator.active = false;"
			/>
		</v-dialog>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { INIT_EXAMS, CREATE_EXAM, EXAM_RECORDS, EXAM_SUMMARY,
	LOAD_ACTIONS, ACTION_SELECTED
} from '@/store/actions.type';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR, 
	SET_EXAM_CREATE_PARAMS, SET_EXAM_TITLE
} from '@/store/mutations.type';
import { onError, getRouteTitle, todayString } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'ExamNewView',
	data() {
		return {
			bread: {
            items: []
			},
			prevRoute: null,
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
            selected: false,
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
		...mapGetters(['exam', 'errorList','contentMaxWidth']),
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
      },
		canBack() {
			if(this.prevRoute && this.prevRoute.name) {
				let name = this.prevRoute.name;
				return name === 'exams';
			} return false;
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.prevRoute = from
		});
	},
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	beforeMount() {
		if(this.createParams) {
			this.params = { ...this.createParams };
			this.$nextTick(() => {
				this.$store.commit(SET_EXAM_CREATE_PARAMS, null);
			});
		}else {
			if(this.indexModel) {
				this.launchCreator();
			}else {
				this.$store.dispatch(INIT_EXAMS)
				.then(() => {
					this.$nextTick(() => {
						this.launchCreator();
					})
				})
				.catch(error => {
					onError(error);
				})
			}
		}

		this.title = getRouteTitle(this.$route);
		this.addBreadItem('', this.title);
		this.addBreadItem('', '新測驗');
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		launchCreator() {
         this.creator.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.creator.active = true;
		},
		onCreatorSubmit(params, model) {
			this.params = { ...params };

         this.creator.model = model;
			this.creator.active = false;
			this.setTitle();

			this.createExam(params);
		},
		createExam(params) {
			if(!params) params = this.params;

         this.$store.dispatch(CREATE_EXAM, params)
         .then(() => {
				this.$nextTick(() => {
					
					this.examEdit.init();
					this.setActions();
				});

				let bread =  this.bread;
				let title = bread.items[bread.items.length - 1].text;
				title = `${title}_${todayString().replace(/-/g,'')}`;
				
				this.$store.commit(SET_EXAM_TITLE, title);
				
         })
			.catch(error => {
            if(error.status) {
					Bus.$emit('errors', error);
				}else {
					this.$store.commit(SET_ERROR, error);
				}
			})
		},
      setTitle() {
			this.clearBread();
			this.addBreadItem('', this.title);
		
			let titleTextList = [];
			let type = this.creator.model.type;
			titleTextList.push(type.text);

			let recruit = this.creator.model.recruit;
			if(recruit) {
				let rootRecruit = this.creator.model.rootRecruit;
				titleTextList.push(rootRecruit.title);
			}
			
			let subject = this.creator.model.subject;
			titleTextList.push(subject.text);

			let title = titleTextList.join('_');
			this.addBreadItem('', title);
		},
		clearBread() {
         this.bread.items = [];
      },
		addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
		},
		setActions() {
			let blocks = [];
         blocks.push([EXAM_RECORDS, EXAM_SUMMARY]);
			blocks.push(this.examActions.map(item => item.name));

			this.$store.dispatch(LOAD_ACTIONS, blocks);
		},
		onActionSelected(name) {
			if(name === EXAM_RECORDS) this.goExamsPage();
			else this.examEdit.handleAction(name);
		},
		onDeleted() {
			this.goExamsPage();
		},
		goExamsPage() {
			if(this.canBack) {
				if(window.history.length) this.$router.go(-1);
				else this.$router.push({ name: 'exams' });
			}else {
				this.$router.push({ name: 'exams' });
			}
		}
   }
}
</script>

<style>

</style>