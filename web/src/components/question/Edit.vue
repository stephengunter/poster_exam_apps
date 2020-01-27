<template>
<v-row :id="element_id">
	<v-col v-if="read_only">
		<p class="q-title">
			<v-icon :color="model.correct ? 'success' : 'error'" class="mr-1 pb-1">
				{{ model.correct ? 'mdi-check-circle' : 'mdi-close-circle'  }}
			</v-icon>
			<span class="mr-1">{{ model.index }}.</span>
			{{ model.question.title }} 
		</p>
		<v-radio-group v-model="selectedIndex" readonly>
			<v-radio v-for="(item, index) in options" :key="index" :value="index">
				<template v-slot:label>
					<a href="#" v-if="item.attachments.length" @click.prevent="showPhoto(item.attachments[0])">
						<img  style="vertical-align:middle;"  :class="{ 'correct-img' : isCorrect(index)}"
						:src="item.attachments[0].previewPath | photoNameUrl(120)"
						>
					</a>
					<span v-if="item.title" v-text="item.title" :class="{ 'correct-answer' : isCorrect(index)}"></span>
				</template>
			</v-radio>
		</v-radio-group>
		<v-expansion-panels style="margin-top:1em" v-show="validResolves.length">
			<v-expansion-panel @click="showResolves" >
      		<v-expansion-panel-header >
					<a v-show="!expansion" href="#" @click.prevent="() => {}" style="text-decoration: none;" >解析</a>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<resolve-item v-for="(resolve, index) in validResolves" :key="index" 
					:model="resolve" 
					@show-photo="showPhoto"
					/>
				</v-expansion-panel-content>
    		</v-expansion-panel>
  		</v-expansion-panels>
	</v-col>
	<v-col v-else>
		<p class="q-title">
			<span class="mr-1">{{ model.index }}.</span>
			{{ model.question.title }} 
		</p>
		<core-deselectable-radio-group 
		:options="options" :selected_index="selectedIndex" text_field="title"
		@selected="onSelect" @show-photo="showPhoto"
		/>
	</v-col>
</v-row> 
</template>

<script>
export default {
	name: 'QuestionEdit',
	props: {
		read_only: {
         type: Boolean,
         default: false
		},
		element_id: {
         type: String,
         default: ''
		},
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

			answerIndexes: [],
			answerIndex: -1,
        
			expansion: false
      }
	},
	computed: {
		validResolves() {
			if(!this.model) return [];
			return this.model.resolves.filter(item => item.reviewed);
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

		if(model.options && model.options.length) {
			this.options = model.options;
		}else {
			let optionIds = model.optionIds.split(',').map(id => Number(id));
			this.optionIds = optionIds;
			for(let i = 0; i < optionIds.length; i++){
				let id = optionIds[i];
				let option = model.question.options.find(item => item.id === id);
				this.options.push({ ...option });
			}
		}

		if(model.answerIndexes) {
			if(this.multi_answers) {
				this.answerIndexes = model.answerIndexes.split(',').map(idx => Number(idx));
			}else {
				this.answerIndex = Number(model.answerIndexes);
			}
		}
	},
	methods: {
		test(val) {
			console.log(val);
		},
		isCorrect(optionIndex) {
			if(this.multi_answers) {
				return this.answerIndexes.includes(optionIndex);
			}else {
				return this.answerIndex === optionIndex;
			}
		},
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

<style scoped>
.correct-img {
	border: 3px solid  #4caf50;
}

.correct-answer {
	color: #4caf50 !important;
   font-size : 1.6em; 
}
</style>