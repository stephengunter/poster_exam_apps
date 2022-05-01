<template>
<div>
   <div class="py-6"></div>
   <v-container class="text-center">
      <h2 class="display-2 font-weight-bold mb-3">
         <span class="cn">功能介紹</span> 
      </h2>
      <v-row>
         <v-col cols="12" md="4">
            <v-card height="320" class="py-12 px-4" color="grey lighten-5" flat>
               <div>
                  <v-avatar color="primary" size="88">
                     <v-icon large color="#fff">mdi-database</v-icon>
                  </v-avatar>
               </div>
               <v-card-title class="justify-center font-weight-black">
                  歷屆試題
					   <v-chip color="success ml-3" small>
						免費
						</v-chip>
               </v-card-title>
               <v-card-text class="subtitle-1" style="text-align: left">
                	<ul>
							<li>
								歷屆考古題與試題解析
							</li>
							<li>
								了解出題方向與難易度
							</li>
						</ul>
               </v-card-text>
            </v-card>
         </v-col>
			<v-col cols="12" md="4">
            <v-card height="320" class="py-12 px-4" color="grey lighten-5" flat>
               <div>
                  <v-avatar color="primary" size="88">
                     <v-icon large color="#fff">mdi-notebook-outline</v-icon>
                  </v-avatar>
               </div>
               <v-card-title class="justify-center font-weight-black">
                  讀書筆記
					   <v-chip color="warning ml-3" small>
						訂閱會員
						</v-chip>
               </v-card-title>
               <v-card-text class="subtitle-1" style="text-align: left">
                	<ul>
							<li>
								完整收錄法條與教科書內容
							</li>
							<li>
								重點濃縮整理，易於吸收
							</li>
							<li>
								精選相關試題，加強記憶
							</li>
						</ul>
               </v-card-text>
            </v-card>
         </v-col>
			<v-col cols="12" md="4">
            <v-card height="320" class="py-12 px-4" color="grey lighten-5" flat>
               <div>
                  <v-avatar color="primary" size="88">
                     <v-icon large color="#fff">mdi-file-document-edit-outline</v-icon>
                  </v-avatar>
               </div>
               <v-card-title class="justify-center font-weight-black">
                  模擬測驗
					   <v-chip color="warning ml-3" small>
						訂閱會員
						</v-chip>
               </v-card-title>
               <v-card-text class="subtitle-1" style="text-align: left">
                	<ul>
							<li>
								精選題庫出題，測驗得分實力
							</li>
							<li>
								檢視測驗紀錄，針對錯題加強
							</li>
						</ul>
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
   <div class="py-6"></div>
</div>
</template>

<script>
import appRoutes from '@/routes/app';
export default {
	name: 'Features',
	data() {
		return {
			pages: []
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
	},
	methods: {
		getIcon(key) {
			return appRoutes.find(item => item.name === key).meta.icon;
		}
	}
}
</script>
