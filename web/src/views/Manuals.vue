<template>
	<v-container>
      <div class="mb-2">
			<core-bread @selected="onBreadSelected" />
      </div>

		<manual-item :item="model" :max_width="maxWidth"
		/>
      
		<v-dialog v-model="category.active" :max-width="category.maxWidth" :persistent="true">
			<manual-category v-if="category.active" :items="list" :params="params"
			:allow_cancel="params.id > 0"
			@selected="onCategorySelected" @cancel="hideCategory"
			/>
      </v-dialog>

		<manual-note-categories v-if="noteCategories.active"
		@cancel="noteCategories.active = false"
		/>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import scrollIntoView from 'scroll-into-view';
import { LOAD_ACTIONS, ACTION_SELECTED, MANUAL_CATEGORY, NOTE_CATEGORY,
FETCH_MANUALS, MANUAL_DETAILS, SHOW_MANUAL } from '@/store/actions.type';
import { tryParseInt, onError, getRouteTitle } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';
import { SET_BREAD_ITEMS, SET_LOADING } from '@/store/mutations.type';

export default {
	name: 'ManualsView',
	data() {
		return {
			pageName: 'manuals',
			title: '',

			version: 0,

			params: {
				id: 0,
				feature: 0
			},

			category: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
			
			noteCategories: {
				active: false
			}
		}
	},
	computed:{
		...mapState({
			list: state => state.manuals.list,
			model: state => state.manuals.model
		}),
		...mapGetters(['currentPage', 'responsive','contentMaxWidth']),
		maxWidth() {
			if(this.responsive) return DIALOG_MAX_WIDTH;
			return 0;
		}
	},
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	beforeMount() {
		this.resolveQuery();
		this.init();
	},
	mounted() {
		this.references = { ...this.$refs };
		window.addEventListener(SHOW_MANUAL, this.onShowManual);
		window.addEventListener(NOTE_CATEGORY, this.showNoteCategories);
	},
	beforeDestroy(){
		window.removeEventListener(SHOW_MANUAL, this.onShowManual);
		window.removeEventListener(NOTE_CATEGORY, this.showNoteCategories);
   },
	watch:{
		$route (to, from){
			if(to.name === this.pageName && from.name === this.pageName) {
				this.resolveQuery();
				this.init();
			}
		}
	},
	methods: {
		resolveQuery() {
			let query = this.$route.query;
			this.params = {
				id: query.id ? tryParseInt(query.id) : 0,
				feature: query.feature ? tryParseInt(query.feature) : 0,
			}
		},
		init() {
			this.pageName = this.$route.name;
			this.title = getRouteTitle(this.$route);
			this.setTitle();

			if(this.list && this.list.length) {
				let id = this.params.id;
				if(id) {
					this.$store.commit(SET_LOADING, true);
					this.$store.dispatch(MANUAL_DETAILS, id);

					this.$nextTick(() => {
						this.onManualLoaded();
					})
				}else {
					this.showCategory();
				}
			}else this.fetchData();

			this.setActions();
		},
		onManualLoaded() {
			let id = this.params.id;
			if(this.model.id != id) {
				setTimeout(() => {
					this.scrollToSubItem(id);
				}, 1000);
			}else this.$store.commit(SET_LOADING, false);
		},
		setActions() {
			let types = [MANUAL_CATEGORY];
			this.$store.dispatch(LOAD_ACTIONS, [types]);
		},
		onActionSelected(name) {
			if(this.$route.name !== this.pageName) return;
			
			if(name === MANUAL_CATEGORY) this.showCategory();
		},
		onBreadSelected(item) {
			this.onActionSelected(item.action);
		},
		scrollToSubItem(id) {
			var element = document.getElementById(`manual_${id}`);
			if(!element) return;
			
			scrollIntoView(element, {
				time: 250
			}, (done) => {
				this.$store.commit(SET_LOADING, false);
			});
			
		},
		setTitle() {
			let items = [{
				action: MANUAL_CATEGORY, text: this.title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		fetchData() {
			this.$store.dispatch(FETCH_MANUALS)
			.then(() => {
				this.$nextTick(() => {
					this.init();	
				})
			})
			.catch(error => {
				onError(error);
			})
		},
		showCategory() {
			this.category = {
				maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
				active: true
			};
		},
		onCategorySelected(item) {
			let name = this.pageName;
			this.$router.push({ name, query: { id: item.id } });

			this.hideCategory();
		},
		hideCategory() {
			this.category.active = false;
		},
		onShowManual(e) {
			let id = e.detail.id;
			this.$router.push({ name, query: { id } });
		},
		showNoteCategories() {
			if(this.$route.name !== this.pageName) return;

			this.noteCategories.active = true;
		}
	}
}
</script>
