<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<v-card v-if="model">
			<v-card-title class="font-weight-black">
				<span style="font-size:1.2em">{{ model.notice.title }}</span>
				
				<v-spacer />
				<span class="subtitle-1">{{ model.notice.lastUpdatedText }}</span>
			</v-card-title>
			<v-card-text>
				<div v-html="model.notice.content">
			
				</div>
			</v-card-text>
			<v-card-actions v-show="canBack">
				<v-spacer />		
				<v-btn @click.prevent="back" class="ma-2" tile outlined color="primary">
					<v-icon left>mdi-arrow-left</v-icon> 返回
				</v-btn>
			</v-card-actions>
		</v-card>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NOTIFICATION_DETAILS } from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';

export default {
	name: 'NotificationDetailsView',
	props: ['id'],
	data() {
		return {
			prevRoute: null
		}
	},
	computed: {
		...mapState({
			model: state => state.notifications.model
		}),
		canBack() {
			if(this.prevRoute) {
				return this.prevRoute.name && this.prevRoute.name === 'notifications';
			} return false;
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.prevRoute = from
		});
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
			let id = tryParseInt(this.id);
		
			this.$store.dispatch(NOTIFICATION_DETAILS, id)
			.then(model => {
				
			})
			.catch(error => {
				onError(error);
			})
		},
		back() {
			if(window.history.length) this.$router.go(-1);
			else this.$router.push({ name: 'notifications' });
		}
   }
}
</script>

<style>

</style>