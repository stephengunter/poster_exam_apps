<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row wrap>
						<v-flex xs12 sm6>
							<v-radio-group v-model="params.active" row>
								<v-radio v-for="(item, index) in activeOptions" :key="index"
								:label="item.text" :value="item.value" 
								@change="onActiveChanged"
								/>
							</v-radio-group>
						</v-flex>
						<v-flex xs12 sm6 text-xs-right>
							<v-tooltip top content-class="top">
								<v-btn :disabled="!canCreate" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
								<span>新增</span>
							</v-tooltip>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs12>
							<plan-table :list="planList"
							@edit="edit" 
							/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>

	  <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<plan-edit v-if="editor.active" :model="editor.model"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import {
   FETCH_PLANS, CREATE_PLAN, EDIT_PLAN, UPDATE_PLAN, STORE_PLAN, DELETE_PLAN
} from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'PlansView',
   data () {
		return {
			params: {
				active: 1
			},
			activeOptions: [{
				value: 1,
				text: '上架中'
			},{
				value: 0,
				text: '已下架'
			}],

			editor: {
				active: false,
				maxWidth: 800,
				model: null
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: 480
			}
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			planList: state => state.plans.list
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		}
   },
   beforeMount(){
		this.fetchData();
   },
   methods: {
		onActiveChanged(val) {
			this.$nextTick(() => {
				this.fetchData();
			})
      },
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_PLANS, this.params)
			.catch(error => {
				onError(error);
			})
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_PLAN)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_PLAN, id)
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
				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		submit(){
			let model = this.editor.model;

			this.$store.commit(CLEAR_ERROR);
			let action = model.id ? UPDATE_PLAN : STORE_PLAN;
         this.$store.dispatch(action, model)
			.then(() => {
				Bus.$emit('success');
				this.setEditModel(null);
				this.fetchData();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		remove(){
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
		cancelDelete(){
			this.deletion.active = false;
			this.deletion.id = 0;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.deletion.id;
			this.$store.dispatch(DELETE_PLAN, id)
			.then(() => {
				this.cancelDelete();
				this.setEditModel(null);
				this.fetchData();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		}
	}
}
</script>

<style>

</style>