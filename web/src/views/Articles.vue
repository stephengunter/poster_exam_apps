<template>
   <v-container>
		<div class="mb-2">
			<core-bread />
      </div>
		<div>
			<router-link v-for="(item, index) in list" :key="index" :to="`/articles/${item.id}/${item.title}`" class="a-btn">
				<v-card class="mt-3">
					<v-card-text>
						<v-row dense>
							<v-col cols="9">
								<span class="title" style="color: #1976d2;" v-text="item.title"></span>
							</v-col>
							<v-col cols="3" class="text-right" style="font-size: 0.75rem;">
								{{ item.lastUpdated | timeAgo }}
							</v-col>
						</v-row>
						<v-row dense >
							<v-col v-html="getSummary(item)">
							</v-col>
						</v-row>	
					</v-card-text>
				</v-card>
			</router-link>
		</div>
   </v-container>
</template>

<script>

import { mapState, mapGetters } from 'vuex';
import { FETCH_ARTICLES } from '@/store/actions.type';
import { ARTICLE_CATEGORIES } from '@/consts';
import { onError, getRouteTitle, removeHtmlTags } from '@/utils';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
export default {
	name: 'ArticlesView',
	data(){
		return {
			params: {

			}
		}
	},
	computed: {
		...mapState({
			list: state => state.articles.list,
		})
	},
	beforeMount() {
		let title = getRouteTitle(this.$route);
		this.setTitle(title);

		this.fetchData();
	},
	methods: {
		setTitle(title) {
			let items = [{
				action: '', text: title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		fetchData() {
			let params = { key: ARTICLE_CATEGORIES.EXPERIENCE }
			
			this.$store.dispatch(FETCH_ARTICLES, params)
			.catch(error => {
				onError(error);
			})
		},
		getSummary(item) {
			if(item.summary) return item.summary;
			return `${removeHtmlTags(item.content).substring(0, 100)} ...`;
		},
		test() {

		}
   }
}
</script>

<style>

</style>