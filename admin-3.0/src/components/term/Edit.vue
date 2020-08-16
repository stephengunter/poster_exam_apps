<template>
	<form @submit.prevent="onSubmit">
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
						<subject-selector ref="subjectSelector" title="科目"
						:subject_list="subject_list"
						@selected="onSubjectSelected"
						/>
						<term-selector ref="termSelector" title="主條文"
						:term_list="parentList"
						@selected="onParentSelected" @changed="onParentChanged"
						/>
						<v-row>
							<v-col cols="12">
								<validation-provider v-slot="{ errors }" name="標題" rules="required">
									<v-text-field label="標題" v-model="model.title" required
									:error-messages="errors"
									/>
								</validation-provider>
							</v-col>
							<v-col cols="12">
								<validation-provider v-slot="{ errors }" name="內容" rules="required">
									<v-textarea v-model="model.text" label="內容" outlined auto-grow
									:error-messages="errors"
									rows="5"
									row-height="15"
									/>
								</validation-provider>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-checkbox v-model="model.chapterTitle" label="章節標題" 
								/>
							</v-col>
							<v-col cols="6">
								<v-checkbox v-model="model.hide" label="隱藏" 
								/>
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
						<v-row>
							<v-col cols="12">
								<v-textarea v-model="model.highlight" label="重點標記" outlined auto-grow
								name="text"
								rows="5"
								row-height="15"
								/>
							</v-col>
							<v-col cols="12">
								<validation-provider v-slot="{ errors }" name="參考">
									<v-textarea v-model="model.reference" label="參考(text, id, type)" outlined auto-grow
									:error-messages="errors"
									rows="5"
									row-height="15"
									@input="clearReferenceError"
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
	</form>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { CREATE, EDIT } from '@/consts';
import { FETCH_TERMS, STORE_TERM,
	UPDATE_TERM, DELETE_TERM
} from '@/store/actions.type';
import Category from '@/models/category';
import { SET_TERM_PARENTS, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { isValidReference, findSubject, onError,
	addErrorMsg, getErrorMsg, clearErrors,
	resolveHighlights, resolveReferences
} from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'TermEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		subject_list: {
         type: Array,
         default: null
		},
	},
	data () {
		return {
			references: {}
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
		...mapState({
			parentList: state => state.terms.parents
		}),
		mode() {
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title() {
			let text = '章節';
			if(this.model.parentId) text = '條文';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove() {
			return this.mode === 'edit';
		},
		subjectSelector() {
			if(this.$refs.subjectSelector) return this.$refs.subjectSelector;
			else if (this.references.subjectSelector) return this.references.subjectSelector;
			return null;
		},
		termSelector() {
			if(this.$refs.termSelector) return this.$refs.termSelector;
			else if (this.references.termSelector) return this.references.termSelector;
			return null;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };
		this.subjectSelector.init(this.model.subjectId);

		this.fetchTerms();
	},
	methods: {
		onSubjectSelected(id) {
			if(!id) return;
			if(id === this.model.subjectId) return;

			this.model.subjectId = id;

			this.subjectSelector.setSubject(id);
			this.subjectSelector.cancelSelect();
			
			this.fetchTerms();
		},
		fetchTerms() {
			this.$store.dispatch(FETCH_TERMS, { subject: this.model.subjectId, parent: -1 })
			.then(terms => {
				this.$store.commit(SET_TERM_PARENTS, terms);
				
				this.$nextTick(() => {
					if(this.model.parentId) {
						let term = this.parentList.find(x => x.id === this.model.parentId);
						if(term) this.termSelector.init([this.model.parentId]);
						else {
							this.model.parentId = 0;
							this.termSelector.init();
						}
					}else this.termSelector.init();
				})
			})
			.catch(error => {
				onError(error);
			})
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

				this.termSelector.setTerm(id);
				this.termSelector.cancelSelect();
			}
		},
		onParentChanged(id) {
			this.model.parentId = id;
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
			this.model.order = parseInt(val);
			this.model.active = this.model.order >= 0;
		},
		cancel(){
			this.$emit('cancel');
		},
		checkReference() {
			let referencesErrorIndex = this.model.references.findIndex(item => !isValidReference(item));
			return referencesErrorIndex < 0;
		},
		addReferenceError(msg = '參考格式錯誤') {
			addErrorMsg(this.validator, '參考', msg);
		},
		clearReferenceError() {
			let errors = clearErrors(this.validator.errors, ['參考']);
			this.validator.setErrors(errors);
		},
		onSubmit() {
			this.model.highlights = resolveHighlights(this.model.highlight);
			this.model.references = resolveReferences(this.model.reference);
			
			this.model.order = parseInt(this.model.order);

			this.submit();   
		},
		submit() {
			this.$store.commit(CLEAR_ERROR);
			this.validator.validate().then(valid => {
				if(!valid) return;

				let referencesValid = this.checkReference();
				if(!referencesValid) {
					this.addReferenceError();
					return;
				}

				this.validator.setErrors({});
				this.$store.commit(CLEAR_ERROR);

				let action = this.model.id ? UPDATE_TERM : STORE_TERM;
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
			this.$store.dispatch(DELETE_TERM, id)
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
