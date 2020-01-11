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
					<question-header ref="questionEditHeader"  
					:multi_terms="true" :allow_create="false"
					:params="params"				
					/>
					<v-layout wrap>
						<v-flex xs12>
							<v-textarea v-model="model.title" label="標題" outlined auto-grow
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							name="title"
							rows="5"
							row-height="15"
							/>
						</v-flex>
						<v-flex xs12>
							<v-checkbox v-model="model.multiAnswers" label="複選" 
							/>
						</v-flex>
					</v-layout>
					<option-edit ref="optionEditor" :init_models="model.options"
						:question_id="model.id" :multi_answers="model.multiAnswers"
						@submit="onOptionSubmit"
					/>
					<core-error-list />
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
import { SET_ERROR } from '@/store/mutations.type';
export default {
	name: 'QuestionEdit',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			params: {
				subject: 0,
				terms: '',
				recruits: ''
			}
			
		}
	},
	computed: {
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			let text = '問題';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			return this.mode === 'edit';
		}
	},
	beforeMount(){
		this.init();		
	},
	mounted(){
		
	},
	methods: {
		init() {
			this.params.subject = this.model.subjectId;
			this.params.terms = this.model.termIds ? this.model.termIds : '';
		
			if(this.model.recruits.length) {
				let recruitIds = this.model.recruits.map(item => item.id);
				this.params.recruits = recruitIds.join();
			}
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '標題').replace('optionsText', '選項');
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
			
			this.model.subjectId = this.params.subject;
			this.model.termIds = this.params.terms;

			let recruits = this.$refs.questionEditHeader.recruit.recruits;
			if(recruits && recruits.length) this.model.recruits = recruits.slice(0);
			else this.model.recruits = [];

         this.$validator.validate().then(valid => {
				if(valid) this.$refs.optionEditor.submit();
         });       
		},
		checkOptions(options) {
			if(!options.length) return '必須要有選項';
			let msg = '';
			let correctCount = 0;
			for(let i = 0; i < options.length; i++) {
            if(options[i].correct) correctCount += 1;
			}
			if(correctCount === 0) return '必須要有正確的選項';

			if(this.model.multiAnswers) {
				
			}else {
				if(correctCount > 1) msg = '單選題只能有一個正確選項';
			}

			return msg;
		},
		onOptionSubmit(options){
			let msg = this.checkOptions(options);
			if(msg) {
				this.$store.commit(SET_ERROR, { 'options' : [msg] });
				return;
			}
			
			this.model.options = options.slice(0);
			this.model.options.forEach(option => {
				if(option.medias.length) {
					option.attachments = option.medias.map(item => {
						return {
							name: item.file.name
						}
					})
				}
			});
			
			this.$emit('submit');
			
		}
	}
}
</script>
