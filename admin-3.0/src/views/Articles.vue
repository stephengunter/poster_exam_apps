<template>
	<core-container>
      <article-header :params="params" :can_create="canCreate"
		:category_options="categoryOptions" :active_options="activeOptions"
		@submit="onParamsChanged" @create="onCreate"
		/>
		<v-row v-if="pagedList">
         <v-col cols="12">
            <article-table :list="dataList"
				@off="onOff" @edit="onEdit"
				/>
         </v-col>
      </v-row>
		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<div v-if="editor.model">
				<article-edit :model="editor.model" :version="editor.version"
				:category_options="categoryOptions" :active_options="activeOptions"
				@saved="onSaved" @cancel="cancelEdit"
				/>
			</div>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_ARTICLES, CREATE_ARTICLE, EDIT_ARTICLE, OFF_ARTICLE } from '@/store/actions.type';
import { onError, isTrue, scrollToTop } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ArticlesView',
   data () {
		return {
			params: {
				category: 0,
				active: 1,
				page: 1,
				pageSize: 10
			},

			categories: [],

			activeOptions: [{
				value: 1,
				text: '上架中'
			},{
				value: 0,
				text: '已下架'
			}],

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				version: 0
			},

			references: {}
			
		}
	},
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			pagedList: state => state.articles.pagedList
		}),
		categoryOptions() {
			if(this.categories && this.categories.length) {
				return this.categories.map(item => ({
					value: item.id, text: item.title
				}));
			}
			return [];
		},
		isActive() {
			return isTrue(this.params.active);
		},
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
		},
		canCreate(){
			if(!this.params.category) return false;
			return !this.editor.active;
		},
	},
	beforeMount() {
		this.$store.dispatch(FETCH_ARTICLES, this.params)
			.then(model => {
				this.params.category = model.categories[0].id;
				this.categories = model.categories;
			})
			.catch(error => {
				onError(error);
			});
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		onParamsChanged() {
			this.params.page = 1;
			this.$nextTick(() => {
				this.fetchData();
			})
		},
		onPageChanged(page) {
			this.params.page = page;
			this.fetchData();
		},
		onPageSizeChanged(size) {
			this.params.pageSize = size;
			this.params.page = 1;
			this.fetchData();
		},
		fetchData() {
			this.$store.dispatch(FETCH_ARTICLES, this.params)
			.catch(error => {
				onError(error);
			});

			scrollToTop();
		},
		onCreate() {
			if(!this.canCreate) return;
			
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_ARTICLE)
			.then(model => {
				model.categoryId = this.params.category;
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
				this.editor.version += 1;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
		onOff(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(OFF_ARTICLE, { id })
			.then(() => {
				this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		},
		cancelEdit() {
			this.setEditModel(null);
		},
		onEdit(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_ARTICLE, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		cancelEdit() {
			this.setEditModel(null);
		},
		onSaved(model) {
			if(model) {
				this.setEditModel(model);
			}else {
				Bus.$emit('success');
				this.fetchData();
				this.setEditModel(null);
			}
			
		}
		
	}
}
</script>

<style>

</style>