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
						<v-flex xs12 sm6>
							<v-select label="年度"
								:items="year_options" v-model="model.year"
							/>
						</v-flex>
						<v-flex xs12 sm6>
							<v-text-field v-model="model.title" label="名稱"
							v-validate="'required'"
							:error-messages="getErrMsg('title')"
							name="title"
							required
							/>
						</v-flex>
						<v-flex xs12 sm6>
							<v-menu full-width max-width="290"
							v-model="date.active"
							:close-on-content-click="false"
							>
								<template v-slot:activator="{ on }">
									<v-text-field clearable label="日期" readonly
									:value="model.dateText" v-on="on"
									/>
								</template>
								<v-date-picker locale="zh-cn"
									v-model="model.dateText"
									@input="onDateChanged" 
								/>
							</v-menu>
						</v-flex>
						<v-flex xs12 sm6>
							<v-switch
							v-model="model.done"
							label="已結束"
							/>
						</v-flex>
						<v-flex xs12 sm6>
							<v-switch
							v-model="model.active"
							label="上架中"
							/>
						</v-flex>
					</v-layout>
					<recruit-sub-item-edit ref="subItemsEditor" :init_models="model.subItems"
						:parent_id="model.id" :subject_options="subject_options" 
						@submit="onSubItemsSubmit"
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
	</form>	
</template>


<script>
import uniq from 'lodash/uniq';
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';
export default {
	name: 'RecruitEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		year_options: {
         type: Array,
         default: null
		},
		subject_options: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			date: {
				active: false,
				val: ''
			}
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
			return this.mode === 'edit' && !this.model.active;
		}
	},
	beforeMount(){
		
	},
	methods: {
		onDateChanged(val) {
			this.date.active = false;
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '名稱').replace('order', '順序').replace('text', '內容');
			}
			return '';
		},
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.$emit('cancel');
		},
		onSubItemsSubmit(items) {
			let msg = this.checkSubItems(items);
			if(msg) {
				this.$store.commit(SET_ERROR, { 'subItems' : [msg] });
				return;
			}

			this.model.subItems = items.slice(0);
			this.$emit('submit');
		},
		checkSubItems(items) {
			if(!items.length) return '必須要有筆試項目';

			let subjectIds = items.map(item => item.subjectId);
			if(subjectIds.length !==  uniq(subjectIds).length) {
				return '筆試科目重複了';
			}
		
			return '';
		},
		onSubmit() {
			this.$store.commit(CLEAR_ERROR);
			this.$validator.validate().then(valid => {
				if(valid) this.$refs.subItemsEditor.submit();
			});
			      
		}
	}
}
</script>
