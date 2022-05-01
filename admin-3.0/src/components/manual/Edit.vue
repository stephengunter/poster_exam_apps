<template>
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
			<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
			<v-spacer />
			<v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<validation-observer ref="validator">
				<v-container>
					<v-row>
						<v-col cols="12" v-if="model.parentId">
							<v-select label="Parent"
							:items="parent_options" v-model="model.parentId"
							/>
						</v-col>
						<v-col cols="12">
							<validation-provider v-slot="{ errors }" name="標題" rules="required">
								<v-text-field label="標題" required
								v-model="model.title"
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12">
							<v-textarea v-model="model.summary" label="簡介" outlined auto-grow
							name="summary" rows="5" row-height="15"
							/>
						</v-col>
						<v-col cols="12">
							<v-textarea v-model="model.content" label="內容" outlined auto-grow
							name="content" rows="5" row-height="15"
							/>
						</v-col>
						<v-col cols="6">
							<v-switch v-model="model.active" label="上架中"
							@change="onActiveChanged"
							/>
						</v-col>
						<v-col cols="6">
							<validation-provider v-slot="{ errors }" name="排序" rules="required|integer">
                        <v-text-field label="排序" v-model="model.order" required
                        :error-messages="errors"
								@change="onOrderChanged"
                        />
                     </validation-provider>
						</v-col>
						<v-col cols="12">
							<v-switch v-model="model.free" label="免費"
							/>
						</v-col>
					</v-row>

					<core-error-list  />

					<v-row>
						<v-col cols="6" class="text-left">
                     <v-btn v-if="canRemove" @click.prevent="onRemove" color="error darken-1">刪除</v-btn>
                  </v-col>
                  <v-col cols="6" class="text-right">
                     <v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
                  </v-col>
               </v-row>

				</v-container>
			</validation-observer>
		</v-card-text>
	</v-card>
</template>


<script>
import { STORE_MANUAL, UPDATE_MANUAL, DELETE_MANUAL } from '@/store/actions.type';
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';
import { CREATE, EDIT } from '@/consts';

export default {
	name: 'ManualEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		parent_options: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			references: {}
		}
	},
	computed: {
		mode() {
			if(this.model && this.model.id) return EDIT;
			return CREATE;
		},
		isCreate() {
			return this.mode === CREATE;
		},
		title() {
			let text = '手冊';
			if(this.isCreate) return `新增${text}`;
			return `編輯${text}`;	
		},
		canRemove() {
			if(this.isCreate) return false;
			return !this.model.active;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		cancel() {
			this.validator.reset();
			this.$emit('cancel');
		},
		onActiveChanged(val) {
			if(this.model.active) {
				if(this.model.order < 0) this.model.order = 0;
			}else {
				if(this.model.order > -1) this.model.order = -1;
			}
		},
		onOrderChanged(val) {
			if(isNaN(val)) return;
			this.model.order = tryParseInt(val);
			this.model.active = this.model.order >= 0;
      },
		onSubmit() {
			this.$store.commit(CLEAR_ERROR);
			this.validator.validate().then(valid => {
				if(!valid) return;
				
				let action = this.isCreate ? STORE_MANUAL : UPDATE_MANUAL;
				this.$store.dispatch(action, this.model)
				.then(() => {
					this.$emit('saved');
				})
				.catch(error => {
					if(!error)  Bus.$emit('errors');
					else this.$store.commit(SET_ERROR, error);
				})
			});     
		},
		onRemove() {
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_MANUAL, id)
			.then(() => {
				this.$emit('saved');
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		}
	}
}
</script>
