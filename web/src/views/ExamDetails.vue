<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
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
LOAD_ACTIONS, ACTION_SELECTED } from '@/store/actions.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';

export default {
	name: 'ExamDetailsView',
	props: ['id'],
	data() {
		return {
			bread: {
            items: []
			},
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
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.fetchData();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
      setTitle() {
			this.clearBread();
			this.addBreadItem('', this.title);
		},
		clearBread() {
         this.bread.items = [];
      },
		addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
		},
		fetchData() {
			let id = tryParseInt(this.id);
         this.$store.dispatch(READ_EXAM, id)
         .then(() => {
				this.$nextTick(() => {
					
					this.examEdit.init();
					this.setActions();

					this.addBreadItem('', this.exam.title ? this.exam.title : '無存檔名稱');
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