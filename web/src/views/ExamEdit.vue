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
      
		
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EDIT_EXAM, EXAM_RECORDS, EXAM_SUMMARY,
LOAD_ACTIONS, ACTION_SELECTED } from '@/store/actions.type';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { tryParseInt, getRouteTitle } from '@/utils';

export default {
	name: 'ExamEditView',
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
		...mapGetters(['exam', 'errorList']),
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
			this.$store.commit(CLEAR_ERROR);

			let id = tryParseInt(this.id);
         this.$store.dispatch(EDIT_EXAM, id)
         .then(() => {
				this.$nextTick(() => {
					
					this.examEdit.init();
					this.setActions();

					this.addBreadItem('', this.exam.title ? this.exam.title : '無存檔名稱');
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