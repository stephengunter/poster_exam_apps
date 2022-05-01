<template>
   <core-container>
		<v-row>
			<v-col cols="8">
				<v-radio-group v-model="params.active" row @change="onActiveChanged">
					<v-radio v-for="(item, index) in activeOptions" :key="index"
					:label="item.text" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
			<v-col cols="4" class="text-right">
				<v-tooltip  top>
					<template v-slot:activator="{ on, attrs }">
						<v-btn  small fab dark color="info" class="mt-3"
						:disabled="!canCreate" @click.prevent="create"  v-bind="attrs" v-on="on"
						>
							<v-icon dark>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>新增</span>
				</v-tooltip>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<plan-table :list="planList"
				@edit="edit" @clear="clearPlan" 
				/>
			</v-col>
		</v-row>

	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<plan-edit v-if="editor.active" :model="editor.model"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import {
   FETCH_PLANS, CREATE_PLAN, EDIT_PLAN, UPDATE_PLAN, CLEAR_PLAN, STORE_PLAN, DELETE_PLAN
} from '@/store/actions.type';
import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

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
				id: 0
			},

			clear: {
				id: 0
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
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit() {
			this.setEditModel(null);
		},
		submit() {
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
		remove(id) {
			this.deletion.id = id;

			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => { this.deletion.id = 0 }
			});
		},
		submitDelete() {
			this.$store.commit(CLEAR_ERROR);
			let id = this.deletion.id;
			this.$store.dispatch(DELETE_PLAN, id)
			.then(() => {
				this.deletion.id = 0
				this.setEditModel(null);
				this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		},
		clearPlan(id) {
			this.clear.id = id;
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要結算嗎?',
				onOk: this.submitClear,
				onCancel: () => { this.clear.id = 0 }
			});
		},
		submitClear() {
			this.$store.commit(CLEAR_ERROR);
			let id = this.clear.id;
			this.$store.dispatch(CLEAR_PLAN, id)
			.then(() => {
				this.clear.id = 0
				this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		}
	}
}
</script>