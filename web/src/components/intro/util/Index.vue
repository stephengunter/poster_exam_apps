<template>
   <v-card class="mx-auto" max-width="300">
      <v-list>
         <v-list-item-group v-model="selectedIndex" color="primary">
            <intro-util-list v-for="(page, index) in pages" :key="index"
            :page="page" :divider="index < pages.length - 1"
            @selected="onSelected"
            />
         </v-list-item-group>
      </v-list>
   </v-card>
</template>

<script>
import appRoutes from '@/routes/app';
export default {
   name: 'IntroUtilIndex',
   data() {
		return {
			selectedIndex: 0,
         pages: [],
         items: []
		}
   },
   beforeMount() {
		let rqs = {
			key: 'rqs', title: '歷屆試題', icon: this.getIcon('rqs'),
			items: [{
				id: 'rqs-read', title: '閱讀模式', free: true
			},{
				id: 'rqs-exam', title: '測驗模式', free: true
			}]
		};
		this.pages.push(rqs);

		let notes = {
			key: 'notes', title: '讀書筆記', icon: this.getIcon('notes'),
			items: [{
				id: 'notes-read', title: '閱讀', free: false
			}]
		};
		this.pages.push(notes);

		let exams = {
			key: 'exams', title: '模擬測驗', icon: this.getIcon('exams'),
			items: [{
				id: 'exams-read', title: '查看記錄', free: true
			},{
				id: 'exams-create', title: '隨機測驗', free: false
			}]
		};
      this.pages.push(exams);
      
      this.items = this.pages.flatMap(page => page.items);
	},
	methods: {
		test() {

		},
		getIcon(key) {
			return appRoutes.find(item => item.name === key).meta.icon;
		},
      onSelected(id) {
         this.selectedIndex = this.items.findIndex(x => x.id === id);
      }
	}
}
</script>

<style>

</style>