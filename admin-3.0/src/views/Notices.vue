<template>
	<core-container>
      <notice-header :params="params" :can_create="canCreate"
		:open_options="openOptions" :active_options="activeOptions"
		@submit="onParamsChanged" @create="onCreate"
		/>
		<v-row v-if="pagedList">
         <v-col cols="12">
            <notice-table :list="dataList"
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
				<notice-edit :model="editor.model" :version="editor.version"
				:open_options="openOptions" :active_options="activeOptions"
				@saved="onSaved" @cancel="cancelEdit"
				/>
			</div>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_NOTICES, CREATE_NOTICE, EDIT_NOTICE, OFF_NOTICE } from '@/store/actions.type';
import { onError, isTrue, scrollToTop } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'NoticesView',
   data () {
		return {
			params: {
				open: 1,
				active: 1,
				
				page: 1,
				pageSize: 10
			},

			openOptions: [{
				value: 1,
				text: '公開的'
			},{
				value: 0,
				text: '個人的'
			}],

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
			pagedList: state => state.notices.pagedList
		}),
		isActive() {
			return isTrue(this.params.active);
		},
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
		},
		canCreate(){
			if(!this.params.open) return false;
			return !this.editor.active;
		},
	},
	beforeMount() {
		this.fetchData();
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
			this.$store.dispatch(FETCH_NOTICES, this.params)
			.catch(error => {
				onError(error);
			});

			scrollToTop();
		},
		onCreate() {
			if(!this.canCreate) return;
			
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_NOTICE)
			.then(model => {
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
			this.$store.dispatch(OFF_NOTICE, { id })
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
			this.$store.dispatch(EDIT_NOTICE, id)
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