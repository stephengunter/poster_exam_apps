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
		
	},
	methods: {
		
	}
}
</script>
