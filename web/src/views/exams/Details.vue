<template>
   <v-container>
      <div class="mb-2">
			<core-bread @selected="onBreadSelected" />
      </div>
		<div v-show="exam">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
			@aborted="onDeleted"
         /> 
      </div>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { READ_EXAM, EXAM_RECORDS, EXAM_SUMMARY,
	LOAD_ACTIONS, ACTION_SELECTED
} from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';

export default {
	name: 'ExamDetailsView',
	props: ['id'],
	data() {
		return {
			pageName: 'exam-details',
			title: '',
			
			prevRoute: null,
			references: {}
		}
	},
	computed: {
		...mapState({
			examActions: state => state.exams.actions
		}),
		...mapGetters(['exam']),
		examEdit() {
			if(this.$refs.examEdit) return this.$refs.examEdit;
			else if (this.references.examEdit) return this.references.examEdit;
			return null;
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
		this.pageName = this.$route.name;
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.fetchData();
	},
	mounted() {
		this.references = { ...this.$refs };
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
			let id = tryParseInt(this.id);
         this.$store.dispatch(READ_EXAM, id)
         .then(() => {
				this.$nextTick(() => {
					this.examEdit.init();
					this.setActions();
					this.setTitle();
				})
         })
			.catch(error => {
				onError(error);
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
		goExamsPage() {
			this.$router.push({ name: 'exams' });
		}
   }
}
</script>

<style>

</style>