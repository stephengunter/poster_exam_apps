<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, getRouteTitle } from '@/utils';

export default {
	name: 'NoticesView',
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