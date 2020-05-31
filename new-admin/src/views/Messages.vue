<template>
	<v-container>
		<core-bread />
		<message-header :params="params" :status_options="statusOptions"
		@submit="fetchData"
		/>
	</v-container>
   <!-- <v-container fluid grid-list-xl fill-height>
       <v-layout v-if="ready" justify-center  align-center>
			<v-flex xs12>
				<material-card>
					
					<message-header :params="params" :status_options="statusOptions"
					@submit="fetchData"
					/>
					<v-layout row wrap>
						<v-flex xs12>
							<message-table :list="viewList"
							@edit="onEdit"
							/>
						</v-flex>
					</v-layout>
					<v-flex xs12>
						<core-table-pager v-show="viewList.length > 0"
						:model="pagedList" :responsive="responsive"
						@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
						/>
					</v-flex>
				</material-card>
			</v-flex>
      </v-layout>
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<div v-if="editor.model">
				<message-details v-if="editor.model.returned" :model="editor.model"
				@cancel="cancelEdit"
				/>
				<message-edit v-else :model="editor.model"
				@saved="onSaved" @cancel="cancelEdit"
				/>
			</div>
			
		</v-dialog>
	</v-container> -->
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_MESSAGES, EDIT_MESSAGE } from '@/store/actions.type';
import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'MessagesView',
   data () {
		return {
			ready: false,
			params: {
				status: 0,
				start: '',
				end: '',
				page: 1,
				pageSize: 10
			},

			statusOptions: [{
				value: 0,
				text: '未回覆'
			},{
				value: 1,
				text: '已回覆'
			}],

			pagedList: null,

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
			}
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		viewList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			}return [];
		}
   },
   beforeMount(){
		this.fetchData();
   },
   methods: {
		onPageChanged(page){
			this.params.page = page;
			this.onParamsChanged();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.onParamsChanged();
		},
		onParamsChanged() {
			this.fetchData();
		},
		fetchData(){
			this.$store.dispatch(FETCH_MESSAGES, this.params)
			.then(model => {
				this.pagedList = model;	
				
				this.$nextTick(() => {
					this.ready = true;
				})
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model;

				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
		onEdit(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_MESSAGE, id)
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
		onSaved() {
			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		}
		
	}
}
</script>

<style>

</style>