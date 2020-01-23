<template>
<v-row>
	<v-col>
		<div>
			<p class="q-title">
				<span v-if="false">
					<v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
					<!-- <v-icon color="error" class="mr-1">mdi-close-circle</v-icon> -->
				</span>
				<span class="mr-1">{{ model.index }}.</span>
				{{ model.question.title }}
			</p>
			<core-deselectable-radio-group 
			:options="options" :selected_index="selectedIndex" text_field="title"
			@selected="onSelect" @show-photo="showPhoto"
			/>
	   </div>
	</v-col>
</v-row> 
</template>

<script>
export default {
	name: 'QuestionEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		multi_answers: {
			type: Boolean,
         default: false
		},
		clearable: {
			type: Boolean,
         default: true
		}
	},
	data(){
      return {
			selectedIndex: -1,
			selectedIndexes: [],

			optionIds: [],
			options: [],
			
        
			expansion: false,
			testmodel: null
      }
	},
	beforeMount() {
		let model = this.model;

		let userAnswerIndexes = model.userAnswerIndexes;
	   if(userAnswerIndexes) {
			if(this.multi_answers) {
				this.selectedIndexes = userAnswerIndexes.split(',').map(id => Number(id));
			}else this.selectedIndex = Number(userAnswerIndexes);
		}

		let optionIds = model.optionIds.split(',').map(id => Number(id));
		this.optionIds = optionIds;
		for(let i = 0; i < optionIds.length; i++){
			let id = optionIds[i];
			let option = model.question.options.find(item => item.id === id);
			this.options.push({ ...option });
		}
	},
	mounted() {
		// console.log(this.model);
	},
	computed: {
		validResolves() {
			if(!this.model) return [];
			return this.model.resolves.filter(item => item.reviewed);
		}
	},
	methods: {
		onSelect(index) {
			if(this.multi_answers) {

			}else {
				if(index === this.selectedIndex) {
					if(this.clearable) this.clearAnswer();
				}else {
					this.selectedIndex = index;
					this.setAnswer(index);
				}
			}

			this.$emit('answer-changed');
		},
		clearAnswer() {
			if(!this.clearable) return;

			if(this.multi_answers) {

			}else {
				this.model.userAnswerIndexes = '';
				this.selectedIndex = -1;
			}
		},
		setAnswer(index) {
			if(this.multi_answers) {

			}else {
				this.model.userAnswerIndexes = String(index);
			}
		},
		showResolves() {
			this.expansion = !this.expansion;
		},
      showPhoto(photo) {
         this.$emit('show-photo', photo);
      }
   }
};
</script>