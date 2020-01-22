<template>
	<v-container>
	   <core-confirmation :title="confirm.title" :text="confirm.text"
      @ok="confirmOk" @cancel="hideConfirm"
      >
		<v-container>
            <v-row>
               <v-col cols="12">
                  <v-textarea v-model="title" label="標題" outlined auto-grow
                  rows="2"
                  row-height="15"
                  />
               </v-col>
            </v-row>
      </v-container>
		</core-confirmation>
	</v-container>
</template>

<script>
export default {
	name: 'HomeView',
	data() {
		return {
			title: 'plplpl',
			 confirm: {
            title: '測驗存檔',
            text: '',
            active: false,
            action: '',
				maxWidth: 480
         },
		}
	},
	created(){
		
	},
	beforeMount() {
		let title='歷屆試題 > 測驗 > 108年度 > 專業科目(1)：臺灣自然及人文地理_20200121';
		console.log(title.replace(/\s/g,'').replace(/>/g,'_'));
		
	},
	methods: {
		
	}
}
</script>
