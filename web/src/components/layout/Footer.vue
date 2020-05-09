<template>
	<v-footer color="success" app>
		<div style="font-size:14px">
			<span class="white--text">&copy; 2020</span>
			<span class="white--text ml-1">考試學習器</span>
		</div>
		<div class="ml-3">
			<v-btn text @click="linkTo('/contact')">
				<span class="white--text" style="font-size:1rem">聯絡我們</span>
			</v-btn>
			<v-btn v-show="false" text @click="linkTo('/notices')" style="margin-left:1px; padding-left:1px">
				<span class="white--text" style="font-size:1rem">公告訊息</span>
			</v-btn>
		</div>
		
		
	</v-footer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	name: 'TheFooter',
	computed:{
		...mapGetters(['footerMenus'])
	},
	methods:{
      showMenu(key) {
         return this.footerMenus.findIndex(item => item.name === key) > -1;
		},
		linkTo(path) {
			let currentRoute = this.$router.currentRoute;
			if(currentRoute && currentRoute.path === path) {
				//do nothing
			} else this.$router.push({ path });  
		}
	}
}
</script>
