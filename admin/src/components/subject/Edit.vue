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
					<core-category-selector ref="categorySelector" title="主科目"
					:all_items="all_items" :select_default="false"
					:selected_id="model.parentId"
					@select-changed="onCategorySelected"
					/>
					<v-layout row>
						<v-text-field v-model="model.title" label="標題"
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
		all_items: {
         type: Array,
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
			if(this.mode === 'edit') return '編輯科目';
			return '新增科目';			
		},
		canRemove(){
			return this.mode === 'edit';
		}
	},
	beforeMount() {
		setTimeout(() => {
			this.$refs.categorySelector.init();
		}, 500);
	},
	methods: {
		onCategorySelected(item) {
			if(item) this.model.parentId = item.id;
			else this.model.parentId = 0;
		},
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
			let parent = this.$refs.categorySelector.getSelectedItem();
			this.onCategorySelected(parent);

         this.$validator.validate().then(valid => {
				if(valid) this.$emit('submit');
			});   
		}
	}
}
</script>
