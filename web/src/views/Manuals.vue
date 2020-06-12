<template>
	<v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<manual-item :item="model" />
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_MANUALS } from '@/store/actions.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';

export default {
	name: 'ManualsView',
	data() {
		return {
			title: '',
			bread: {
            items: []
			},

			params: {
				id: 0,
				feature: 0
			}
		}
	},
	computed:{
		...mapState({
			list: state => state.manuals.list,
			model: state => state.manuals.model
		})
	},
	beforeMount() {
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		let query = this.$route.query;
		this.params = {
			id: query.id ? tryParseInt(query.id) : 0,
			feature: query.feature ? tryParseInt(query.feature) : 0,
		}
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
			this.$store.dispatch(FETCH_MANUALS, this.params)
			.catch(error => {
				console.error(error);
				//onError(error);
			})
		}
	}
}
</script>
