<template>
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
			<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
			<v-spacer />
			<v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text v-if="model.parentId === 0">
			<validation-observer ref="validator">
				<v-container>
					<v-row>
						<v-col cols="12" sm="6">
							<validation-provider v-slot="{ errors }" name="年度">
								<v-select label="年度" :error-messages="errors"
								:items="year_options" v-model="model.year"
								@change="clearYearError"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12" sm="6">
							<validation-provider v-slot="{ errors }" name="名稱" rules="required">
								<v-text-field label="名稱" v-model="model.title" required
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12" sm="6">
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
							
						</v-col>
						<v-col cols="12" sm="6">
							<v-switch
							v-model="model.done"
							label="已結束"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-switch
							v-model="model.active"
							label="上架中"
							/>
						</v-col>
					</v-row>
					<recruit-sub-item-edit ref="subItemsEditor" :init_models="model.subItems"
					:parent_id="model.id" :subject_options="subject_options" 
					@submit="onSubItemsSubmit"
					/>
					<core-error-list />
				</v-container>
			</validation-observer>
		</v-card-text>
		<v-card-text v-else>
			<v-container>
				<recruit-part-edit ref="partsEditor" :init_models="model.subItems"
				:parent_id="model.id" 
				@submit="onPartsSubmit"
				/>
				<core-error-list  />
			</v-container>
		</v-card-text>

		<v-card-actions>
			<v-container>
				<v-row>
					<v-col cols="6" class="text-left">
						<v-btn v-if="canRemove" @click.prevent="remove" color="error">刪除</v-btn>
					</v-col>
					<v-col cols="6" class="text-right">
						<v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
					</v-col>
				</v-row>
			</v-container>
		</v-card-actions>
	</v-card>
</template>


<script>
import uniq from 'lodash/uniq';
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';
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
			},

			references: {}
		}
	},
	computed: {
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			if(this.model.parentId > 0) return `筆試項目：${this.model.parent.title} ${this.model.title}`;

			let text = '招考';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			return this.mode === 'edit' && !this.model.active;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
		subItemsEditor() {
			if(this.$refs.subItemsEditor) return this.$refs.subItemsEditor;
			else if (this.references.subItemsEditor) return this.references.subItemsEditor;
			return null;
		},
		partsEditor() {
			if(this.$refs.partsEditor) return this.$refs.partsEditor;
			else if (this.references.partsEditor) return this.references.partsEditor;
			return null;
		},
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		onDateChanged(val) {
			this.date.active = false;
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
		onPartsSubmit(items) {
			let msg = this.checkParts(items);
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
		checkParts(items) {
			if(!items.length) return '';

			let points = items.map(item => Number(item.points));
			
			if(points.includes(0))  return '分數錯誤';

			let total = points.reduce((a, b) => a + b);
				
			if(total !== 100) return '分數錯誤';

			return '';
		},
		addYearError(msg = '必須選擇年度') {
			addErrorMsg(this.validator, '年度', msg);
		},
		clearYearError() {
			let errors = clearErrors(this.validator.errors, ['年度']);
			this.validator.setErrors(errors);
		},
		onSubmit() {
			this.$store.commit(CLEAR_ERROR);
			if(this.model.parentId) {
				this.$refs.partsEditor.submit();
			}else {
				this.validator.validate().then(valid => {
					if(!valid) return;
					if(!this.model.year) {
						this.addYearError();
						return;
					}

					this.$refs.subItemsEditor.submit();
				});
			}      
		}
	}
}
</script>
