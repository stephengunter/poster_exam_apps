<template>
	<form @submit.prevent="onSubmit">
		<v-card>
			<v-card-title>
				<span class="headline">{{ title }}</span>
				<v-spacer />
				<a href="#" @click.prevent="cancel">
					<v-icon>mdi-window-close</v-icon>
				</a>
			</v-card-title>
			<v-card-text>
				<v-container grid-list-md>
					<term-selector ref="term_selector"  v-show="selector.term.ready"
						:items="selector.term.items" 
						:selected="selector.term.selected"
						@selected="onParentSelected"
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
							<v-textarea v-model="model.text" label="內容" outlined auto-grow
							v-validate="'required'"
							:error-messages="getErrMsg('text')"
							rows="5"
							row-height="15"
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
</template>


<script>
import { constants } from 'crypto';

export default {
	name: 'TermEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		subjects: {
         type: Array,
         default: null
		},
		parents: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			selector: {
				term: {
					items: [],
					selected: 0,
					ready: false
				}
			},	
		}
	},
	computed: {
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			if(!this.model) return '';

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
		this.selector.term.selected = this.model.parentId;
		this.selector.term.items = this.parents.slice(0);
	},
	mounted(){
		this.$refs.term_selector.init();
	},
	methods: {
		onParentSelected(id){
			if(id !== this.selector.term.selected){
				this.selector.term.selected = id;
			}
			this.selector.term.ready = true;
			this.model.parentId = id;
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
         this.$validator.validate().then(valid => {
            if(valid) this.$emit('submit');
         });         
		}
	}
}
</script>
