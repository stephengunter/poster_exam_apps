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
					<v-layout wrap>
						<v-flex xs12 v-if="model.parentId">
							<v-text-field :value="`${model.parentId} ${model.parentTitle}`" label="Parent" readonly
							/>
						</v-flex>
						<v-flex xs12>
							<v-text-field v-model="model.title" label="標題"
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							name="title"
							required
							/>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.summary" label="簡介" outlined auto-grow
							name="summary"
							rows="5"
							row-height="15"
							/>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.content" label="內容" outlined auto-grow
							name="content"
							rows="5"
							row-height="15"
							/>
						</v-flex>
						<v-flex xs12>
							<v-switch
							v-model="model.active"
							label="上架中"
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
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';
export default {
	name: 'ManualEdit',
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
			let text = '手冊';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			return this.mode === 'edit' && !this.model.active;
		}
	},
	beforeMount(){
		
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
			this.$store.commit(CLEAR_ERROR);
			this.$validator.validate().then(valid => {
				if(valid) this.$emit('submit');
			});     
		}
	}
}
</script>
