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
					<v-layout row>
						<v-flex xs12>
							<v-text-field v-model="model.year" label="年度"
							v-validate="'required|numeric'"
							:error-messages="getErrMsg('year')"
							name="year"
							required
							/>
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-flex xs12>
							<v-text-field v-model="model.title" label="名稱"
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							name="title"
							required
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

export default {
	name: 'RecruitEdit',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			
		}
	},
	computed: {
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			let text = '招考';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			return this.mode === 'edit';
		}
	},
	beforeMount(){
		
		
	},
	methods: {
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
			this.onCategorySelected(parent);

         this.$validator.validate().then(valid => {
				if(valid) this.$emit('submit');
         });         
		}
	}
}
</script>
