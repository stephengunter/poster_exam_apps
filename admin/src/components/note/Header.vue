<template>
<div>
	<v-layout row wrap>
		<v-flex xs6 sm6 md6>
			<core-bread :items="bread.items"
			@selected="onBreadSelected"
			/>
			<!-- <v-select label="科目"
				:items="subject.options" v-model="params.subject"
				@change="onSubjectChanged"
			/> -->
			<!-- <a href="#" @click.prevent="selectSubject"> 科目： {{ subject.fullText }} </a> -->
		</v-flex>
		<v-flex xs6 sm6 md6 text-xs-right>
			
			<!-- <v-tooltip v-if="false" top content-class="top">
				<v-btn :disabled="!canCreate" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<span>新增</span>
			</v-tooltip> -->
		</v-flex>
		
	</v-layout>
	<v-dialog v-model="category.active" persistent :max-width="category.maxWidth">
		<note-category v-if="ready" 
		:subject_list="subjectList" :params="params"
		/>
	</v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { FETCH_SUBJECTS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'NoteHeader',
   props: {
		can_create: {
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
			ready: false,
			category: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			bread: {
            items: []
			},
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			subjectList: state => state.subjects.list
		})
   },
   beforeMount(){
		//只要root科目(考試科目)
		this.$store.dispatch(FETCH_SUBJECTS, { parent: 0, subItems: true })
		.then(subjects => {
			this.$nextTick(() => {
            this.ready = true;
         });
		})
		.catch(error => {
			onError(error);
		})
   },
   methods: {
		init() {
			
		},
		onBreadSelected() {

		}
   }
}
</script>

<style>

</style>