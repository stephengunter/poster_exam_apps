<template>
   <v-container>
      <v-card>
			<v-card-title class="font-weight-black">
				<span style="font-size:1.3em" >聯絡我們</span>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12"> 
						<v-text-field label="Email" placeholder="請填寫您的Email"
						/>
					</v-col>
					<v-col cols="12">
						<v-text-field label="標題"
						placeholder="請填寫您留言的主旨"
						/>
					</v-col>
					<v-col cols="12">
						<v-textarea
							name="content"
							label="內容"
							
						/>
					</v-col>
					
				</v-row>
					<v-btn color="success" large>
						確認送出
					</v-btn>
				<v-row>
				</v-row>
			</v-card-text>
		</v-card>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, getRouteTitle } from '@/utils';

export default {
	name: 'ContactView',
	data(){
		return {
			bread: {
            items: []
			},
		}
	},
	beforeMount() {
		this.title = getRouteTitle(this.$route);
		this.setTitle();
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
   }
}
</script>

<style>

</style>