<template>
	<form @submit.prevent="onSubmit">
		<v-card>
			<v-card-title>
				<span class="headline">{{ title }}</span>
				<v-spacer />
				<v-tooltip top content-class="top">
					<a href="#" @click.prevent="cancel" slot="activator">
						<v-icon>mdi-window-close</v-icon>
					</a>
					<span>取消</span>
				</v-tooltip>
			</v-card-title>
			<v-card-text>
				<v-container grid-list-md>
					<term-selector ref="term_selector"  v-show="selector.term.ready"
						:show_last="true" :want_array="false"
						:items="selector.term.items" 
						:selected_ids="selector.term.selectedIds"
						@selected="onTermSelected"
					/>
					<v-layout row>
						<v-flex xs12>
							<v-textarea name="title" v-model="model.title" label="標題" outlined auto-grow
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							rows="5"
							row-height="15"
							/>
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-flex xs4>
							<div @click.prevent="beginEditingRecruits">
								<v-checkbox :label="recruitsText" v-model="hasRecruits" readonly />
							</div>
						</v-flex>
					</v-layout>
					<option-edit ref="option_editor" :init_models="model.options"
						:question_id="model.id"
						@submit="onOptionSubmit"
					/>	
					<core-error-list  />
				</v-container>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="canRemove" @click.prevent="remove" color="error darken-1">刪除</v-btn>
				<v-spacer />
				<v-btn type="submit" @click.prevent="onSubmit" color="primary">存檔</v-btn>
			</v-card-actions>
		</v-card>
		<v-dialog v-model="recruitSelector.show" width="480px">
			<recruit-selector v-if="recruitSelector.show" :model="recruitSelector.model" 
				:options="recruitSelector.options" 
				@submit="onRecruitSelected"
				@cancel="recruitSelector.show = false"
			/>
		</v-dialog>
	</form>	
</template>


<script>

export default {
	name: 'QuestionEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		terms: {
         type: Array,
         default: null
		},
		recruits: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			selector: {
				term: {
					items: [],
					selectedIds: [],
					ready: false
				}
			},

			recruitSelector: {
				model: [],
				show: false,
				options: []
			},

			hasRecruits: false,
			recruitsText: '考古題'
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
		this.selector.term.items = this.terms.slice(0);

		if(this.model.term && this.model.term.parentIds){
			this.selector.term.selectedIds = this.model.term.parentIds.slice(0);
		}
		this.selector.term.selectedIds.push(this.model.termId);

		this.setRecruits(this.model.recruits);
		
	},
	mounted(){
		this.$refs.term_selector.init();
	},
	methods: {
		beginEditingRecruits(){
			this.recruitSelector.options = this.recruits.map(item => {
				return { value: item.id, text: item.title }
			});
			this.recruitSelector.model = this.model.recruits.map(item => item.id);
			this.recruitSelector.show = true;
		},
		onTermSelected(id){
			this.selector.term.ready = true;
			this.model.termId = id;
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '標題').replace('optionsText', '選項');
			}
			return '';
		},
		addOption(){

		},
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.$emit('cancel');
		},
		onSubmit() {
         this.$validator.validate().then(valid => {
				if(valid) this.$refs.option_editor.submit();
         });       
		},
		setRecruits(recruits){
			this.model.recruits = recruits;
			this.hasRecruits = recruits.length > 0;

			if(recruits.length){
				let titles = recruits.map(item => item.title);
				this.recruitsText = `考古題 (${titles.join()})`;
			}else this.recruitsText = '考古題';
			
		},
		onRecruitSelected(ids){
			let recruits = [];
			if(ids.length) recruits = this.recruits.filter(item => ids.includes(item.id));

			this.setRecruits(recruits);

			this.recruitSelector.show = false;			
		},
		onOptionSubmit(options){
			this.model.options = options.slice(0);
			this.$emit('submit');
			
		}
	}
}
</script>
