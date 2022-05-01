<template>
   <v-container>
      <div class="mb-2">
			<core-bread @selected="onBreadSelected" />
      </div>
		<core-error-list v-if="hasErrors" />
		<div v-show="exam">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
			@aborted="onDeleted"  @stored="onStored"
         /> 
      </div>
      
		
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EDIT_EXAM, EXAM_RECORDS, EXAM_SUMMARY, LEAVE_EXAM,
LOAD_ACTIONS, ACTION_SELECTED } from '@/store/actions.type';
import { SET_BREAD_ITEMS, SET_LOADING, CLEAR_ERROR,
SET_EXAM, SET_ERROR } from '@/store/mutations.type';
import { tryParseInt, getRouteTitle } from '@/utils';

export default {
	name: 'ExamEditView',
	props: ['id'],
	data() {
		return {
			pageName: 'exam-edit',
			title: '',

			prevRoute: null,
			references: {}
		}
	},
	computed: {
		...mapState({
			examActions: state => state.exams.actions
		}),
		...mapGetters(['exam', 'errorList']),
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
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.prevRoute = from
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
		this.pageName = this.$route.name;
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.fetchData();
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
		fetchData() {
			this.$store.commit(CLEAR_ERROR);

			let id = tryParseInt(this.id);
         this.$store.dispatch(EDIT_EXAM, id)
         .then(() => {
				this.$nextTick(() => {
					this.examEdit.init();
					this.setActions();
					this.setTitle();
				})
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
			this.$router.push({ name: 'exams' });
		}
   }
}
</script>

<style>

</style>