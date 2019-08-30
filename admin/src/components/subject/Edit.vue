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
				<v-container>
					<v-layout row>
						<v-flex xs12>
							<v-select
								:items="parentOptions"  label="主科目"
								v-model="model.parentId"
							/>
						</v-flex>
					</v-layout>
					<v-layout row>
						<v-text-field v-model="model.title" label=""
							v-validate="{ required: true }"
							:error-messages="getErrMsg('title')"
							name="title"
							required
						/>
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

import { mapState } from 'vuex';

export default {
	name: 'SubjectEdit',
	props: {
		model: {
         type: Object,
         default: null
      },
	},
	data () {
		return {
			parentOptions: []
		}
	},
	computed: {
		...mapState({
			subjects: state => state.subjects.list,
		}),
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			if(this.mode === 'edit') return '編輯科目';
			return '新增科目';			
		},
		canRemove(){
			return this.mode === 'edit';
		}
	},
	beforeMount(){
		this.parentOptions.push({ value: 0, text: '------------' });
		this.subjects.forEach(item => {
			this.parentOptions.push({ value: item.id, text: item.title });
		});
	},
	methods: {
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '標題');
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
