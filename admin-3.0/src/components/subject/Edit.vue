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
					<subject-selector ref="subjectSelector" title="主科目"
					:subject_list="all_items"
					@selected="onParentSelected"
					/>
					<v-row>
						<v-col cols="12">
							<validation-provider v-slot="{ errors }" name="標題" rules="required">
								<v-text-field label="標題" v-model="model.title" required
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="6">
							<v-switch v-model="model.active" label="上架中" @change="onActiveChanged" />
						</v-col>
						<v-col cols="6">
							<validation-provider v-slot="{ errors }" name="排序" rules="required|integer">
                        <v-text-field label="排序" v-model="model.order" required
                        :error-messages="errors"
								@change="onOrderChanged"
                        />
                     </validation-provider>
						</v-col>
					</v-row>
					<core-error-list  />
					<v-row>
						<v-col cols="6" class="text-left">
							<v-btn v-if="canRemove" @click.prevent="onRemove" color="error">刪除</v-btn>
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
import { mapState, mapGetters } from 'vuex';
import { CREATE, EDIT } from '@/consts';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { STORE_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { findSubject } from '@/utils';

export default {
	name: 'SubjectEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		all_items: {
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
		...mapGetters(['responsive','contentMaxWidth']),
		mode() {
			if(this.model && this.model.id) return EDIT;
			return CREATE;
		},
		title() {
			if(this.mode ===  EDIT) return '編輯科目';
			return '新增科目';			
		},
		canRemove() {
			return this.mode === EDIT;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
		subjectSelector() {
			if(this.$refs.subjectSelector) return this.$refs.subjectSelector;
			else if (this.references.subjectSelector) return this.references.subjectSelector;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };
		this.subjectSelector.init(this.model.parentId);
	},
	methods: {
		onActiveChanged(val) {
			if(this.model.active) {
				if(this.model.order < 0) this.model.order = 0;
			}else {
				if(this.model.order > -1) this.model.order = -1;
			}
		},
		onOrderChanged(val) {
			if(isNaN(val)) return;
			this.model.order = parseInt(val);
			this.model.active = this.model.order >= 0;
		},
		checkParent(id) {
			if(this.mode === EDIT) {
				if(id === this.model.id) return false;
			}
			return true;
		},
		onParentSelected(id) {
			if(id === this.model.parentId) return;

			let valid = this.checkParent(id);
			if(valid) {
				this.model.parentId = id;

				this.subjectSelector.setSubject(id);
				this.subjectSelector.cancelSelect();
			}
		},
		cancel() {
			this.$emit('cancel');
		},
		onSubmit() {
			this.model.order = parseInt(this.model.order);
			this.submit();
		},
		submit() {
			this.$store.commit(CLEAR_ERROR);
			this.validator.validate().then(valid => {
				if(!valid) return;
				
				this.$store.commit(CLEAR_ERROR);
				let action = this.model.id ? UPDATE_SUBJECT : STORE_SUBJECT;
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
			this.$store.dispatch(DELETE_SUBJECT, this.model.id)
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
