<template>
<div>
	<form @submit.prevent="onSubmit">
		<v-card>
			<v-card-title>
				<span class="headline">{{ title }}</span>
				<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
				<v-spacer />
				<a href="#" @click.prevent="cancel">
					<v-icon>mdi-window-close</v-icon>
				</a>
			</v-card-title>
			<v-card-text>
				<v-container grid-list-md>
					<v-layout row v-show="!subject.selecting">
						<v-flex xs12>
							<a href="#" @click.prevent="selectSubject"> 科目：  {{ subject.fullText }} </a>
						</v-flex>
					</v-layout>
					<core-category-selector ref="categorySelector" title="主條文"
					:all_items="allItems" :select_default="false"
					:selected_id="model.parentId"
					@select-changed="onCategorySelected"
					/>
					<v-layout wrap>
						
						<v-flex xs12 sm6 md4>
							<v-text-field v-model="model.order" label="順序"
							v-validate="'required|numeric'"
							:error-messages="getErrMsg('order')"
							name="order"
							required
							/>
						</v-flex>
						<v-flex xs12 sm6 md8>
							<v-text-field v-model="model.title" label="標題"
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							name="title"
							required
							/>
						</v-flex>
						<v-flex xs12>
							<v-checkbox v-model="model.chapterTitle" label="章節標題" 
							/>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.text" label="內容" outlined auto-grow
							v-validate="'required'"
							:error-messages="getErrMsg('text')"
							name="text"
							rows="5"
							row-height="15"
							/>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.highlight" label="重點標記" outlined auto-grow
							name="text"
							rows="5"
							row-height="15"
							/>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.reference" label="參考(text, id, type)" outlined auto-grow
							name="text"
							rows="5"
							row-height="15"
							:error-messages="getErrMsg('reference')"
							/>
						</v-flex>
					</v-layout>
					<core-error-list  />
				</v-container>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="canRemove" @click.prevent="remove" color="error darken-1">刪除</v-btn>
				<v-spacer />
				<v-btn type="submit" @click.prevent="onSubmit" color="primary">存檔</v-btn>
			</v-card-actions>
		</v-card>
	</form>
	<v-dialog v-model="subject.selecting" :max-width="subject.maxWidth">
		<v-card>
			<v-card-text>
				<v-container>
					<core-category-selector ref="subjectSelector" title="科目"
					:all_items="subjects" :selected_id="model.subjectId"
					@select-changed="onSubjectSelected"
					/>
				</v-container>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>	
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING } from '@/store/mutations.type';
import { isValidReference } from '@/utils';

export default {
	name: 'TermEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		all_items: {
         type: Array,
         default: null
		},
		subjects: {
         type: Array,
         default: null
		},
	},
	data () {
		return {
			allItems: [],
			subject: {
				selecting: false,
				maxWidth: 800,
				fullText: ''
			},

			categorySelectedCount: 0
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			let text = '章節';
			if(this.model.parentId) text = '條文';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			return this.mode === 'edit';
		}
	},
	beforeMount(){
		this.$store.commit(SET_LOADING, true);
		setTimeout(() => {
			this.$refs.subjectSelector.init();
		}, 500);
	},
	methods: {
		init(){

		},
		selectSubject() {
			if(this.contentMaxWidth) this.subject.maxWidth = this.contentMaxWidth;
			this.subject.selecting = true;
		},
		onSubjectSelected(item){
			this.$store.commit(SET_LOADING, true);

			let subjectId = 0;
			if(item) subjectId = item.id;
			this.model.subjectId = subjectId;

			this.allItems = this.all_items.filter(item => item.subjectId === subjectId);
			setTimeout(() => {
				this.$refs.categorySelector.init();
			}, 500);

			this.subject.fullText = this.$refs.subjectSelector.getSelectedListText();
			this.subject.selecting = false;		
		},
		onCategorySelected(item) {
			this.categorySelectedCount += 1;

			let parentId = 0;
			if(item) parentId = item.id;

			this.model.parentId = parentId;

			if(this.mode === 'create') {
				if(this.categorySelectedCount > 1) this.getMaxOrder(parentId);
			} 
			
			this.$store.commit(SET_LOADING, false);
		},
		getMaxOrder(parentId) {
			let subjectId = this.model.subjectId;
			let terms = this.all_items.filter(item => item.subjectId === subjectId && item.parentId === parentId);
			if(terms.length) this.model.order = terms[terms.length - 1].order + 1;
			else this.model.order = 0;
		},
		getErrMsg(key){
			
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '標題').replace('order', '順序').replace('text', '內容');
			}
			return '';
		},
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.$emit('cancel');
		},
		onSubmit() {
			
			let parent = this.$refs.categorySelector.getSelectedItem();
			
			if(parent) this.model.parentId = parent.id;
			else  this.model.parentId = 0;

			let highlight = this.model.highlight;
         this.model.highlights = highlight ? highlight.split('\n').filter(Boolean) : [];

			let reference = this.model.reference;
			if(reference) {
				let references = reference.split('\n').filter(Boolean);
					this.model.references = references.map(item => {
					let parts = item.split(',');
					return { text: parts[0], id: parts[1] ? parts[1] : '', type:  parts[2] ? parts[2] : ''}
				});
			}else {
				this.model.references = [];
			}
			
         this.$validator.validate().then(valid => {
				if(valid) {
					let referencesErrorIndex = this.model.references.findIndex(item => !isValidReference(item));
					if(referencesErrorIndex < 0) {
						this.$emit('submit');
					}else {
						this.errors.add({
							field: 'reference',
							msg: '參考格式錯誤'
						});
					}
				} 
         });         
		}
	}
}
</script>
