<template>
	<v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_MANUALS } from '@/store/actions.type';
import { onError, getRouteTitle } from '@/utils';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';

export default {
	name: 'ManualsView',
	data() {
		return {
			title: '',
			bread: {
            items: []
			},

			model: null
		}
	},
	computed:{
		...mapState({
			list: state => state.manuals.list
		})
	},
	beforeMount() {
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.fetchData();
	},
	methods: {
		setTitle() {
			let items = [{
				action: '', text: this.title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		fetchData() {
			this.$store.dispatch(FETCH_MANUALS)
			.catch(error => {
				console.error(error);
				//onError(error);
			})
		}
	}
}
</script>
