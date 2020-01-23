<template>
	<v-container>
	   <v-card class="mx-auto" max-width="300" tile >
			
			<v-list v-for="(block, index) in appActions" :key="index">
				<v-list-item v-for="(item, index) in block" :key="index" @click.prevent="onActionSelected(item.name)">
					<v-list-item-icon v-if="item.icon">
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-divider v-if="index < appActions.length - 1"></v-divider>
			</v-list>
			
		</v-card>
	</v-container>
</template>

<script>
import { SELECT_RQS_MODE, STORE_EXAM, DELETE_EXAM,
   SAVE_EXAM, ABORT_EXAM, NEW_EXAM, EXAM_RECORDS,
   FILTER_EXAMS, EXAM_SUMMARY
} from '@/store/actions.type';
export default {
	name: 'HomeView',
	data() {
		return {
			 appActions: [
				 [{
				views: ['exams'],
				name: FILTER_EXAMS,
				order: 0,
				icon:'mdi-filter-outline',
				title: '篩選',
				description: '篩選測驗紀錄'
				
			},{
				views: ['exams'],
				name: EXAM_RECORDS,
				order: 0,
				icon:'mdi-format-list-bulleted',
				title: '測驗紀錄',
				description: '測驗紀錄'
			},{
				views: ['exams'],
				name: EXAM_SUMMARY,
				order: 0,
				icon:'mdi-file-document-box-outline',
				title: '作答概況',
				description: '作答概況'
			}],
			[{
				views: ['exams'],
				name: FILTER_EXAMS,
				order: 0,
				icon:'mdi-filter-outline',
				title: '篩選',
				description: '篩選測驗紀錄'
				
			},{
				views: ['exams'],
				name: EXAM_RECORDS,
				order: 0,
				icon:'mdi-format-list-bulleted',
				title: '測驗紀錄',
				description: '測驗紀錄'
			},{
				views: ['exams'],
				name: EXAM_SUMMARY,
				order: 0,
				icon:'mdi-file-document-box-outline',
				title: '作答概況',
				description: '作答概況'
			}]
			]
		}
	},
	created(){
		
	},
	beforeMount() {
		
	},
	methods: {
		
	}
}
</script>
