<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>	
		<v-card v-if="model">
			<v-card-title class="font-weight-black">
				<span style="font-size:1.6rem">{{ model.title }}</span>
				<v-spacer />
				<span class="subtitle-1">{{ model.lastUpdatedText }}</span>
			</v-card-title>
			<v-card-text style="font-size: 1rem;">
				<core-article :text="model.content" />
			</v-card-text>
			<v-card-actions>
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
import { SITE_TITLE } from '@/config';
import { ARTICLE_DETAILS } from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';

export default {
	name: 'ArticleDetailsView',
	props: ['id', 'title', 'user'],
	data() {
		return {
			prevRoute: null,
			model: null
		}
	},
	computed: {
		canBack() {
			if(this.prevRoute) {
				return this.prevRoute.name && this.prevRoute.name === 'articles';
			} return false;
		}
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.prevRoute = from
		});
	},
	beforeMount() {
		let text = getRouteTitle(this.$route);
		let items = [{
			action: '', text
		}];
		this.$store.commit(SET_BREAD_ITEMS, items);

		if(this.title) {
			document.title = `${text} > ${this.title} - ${SITE_TITLE}`;
		}

		this.fetchData();
	},
	methods: {
		fetchData() {
			let id = tryParseInt(this.id);
			let user = this.user ? String(this.user) : '';
			
			this.$store.dispatch(ARTICLE_DETAILS, { id, user })
			.then(model => {
				this.model = model;
				let text = getRouteTitle(this.$route);
				if(text) {
					document.title = `${text} > ${model.title} - ${SITE_TITLE}`;
				}
			})
			.catch(error => {
				onError(error);
			})
		},
		back() {
			if(this.canBack && window.history.length) this.$router.go(-1);
			else this.$router.push({ name: 'articles' });
		}
   }
}
</script>

<style>

</style>