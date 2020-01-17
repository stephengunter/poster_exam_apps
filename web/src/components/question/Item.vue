<template>
<v-row>
	<v-col>
		<v-radio-group v-model="radioGroup">
			<p>
				<span v-show="order" class="mr-1">{{ order }}.</span>
				{{ model.title }}
			</p>
			<ul class="options">
				<li v-for="(option,index) in model.options" :key="option.id" :class="{ 'option-display': index > 0, 'correct-option': option.correct }" >

					<div style="display:inline;"> 
						<v-icon v-if="option.correct" color="success">
						mdi-check-circle
						</v-icon>
						<a href="#" v-if="option.attachments.length" @click.prevent="showPhoto(option.attachments[0])">
							<img  style="vertical-align:middle" 
							:src="option.attachments[0].previewPath | photoNameUrl(50)"
							>
						</a>
						
						{{ option.title }}
					</div>
					
				</li>
			</ul>
		</v-radio-group>
		<v-expansion-panels v-show="model.resolves.length">
			<v-expansion-panel @click="showResolves" >
      		<v-expansion-panel-header >
					<a v-show="!expansion" href="#" @click.prevent="() => {}" style="text-decoration: none;" >解析</a>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<ResolveItem v-for="resolve in model.resolves" :key="resolve.id" 
					:model="resolve" 
					@show-photo="showPhoto"
					/>
				</v-expansion-panel-content>
    		</v-expansion-panel>
  		</v-expansion-panels>
	</v-col>
</v-row> 
</template>

<script>
import ResolveItem from '@/components/resolve/Item';
export default {
	name: 'QuestionItem',
	components: {
		ResolveItem
	},
	props: {
		order: {
         type: Number,
         default: 0
		},
		model: {
         type: Object,
         default: null
      },
	},
	data(){
      return {
         radioGroup: 1,
         expansion: false
      }
	},
	computed: {
		validResolves() {
			if(!this.model) return [];
			return this.model.resolves.filter(item => item.reviewed);
		}
	},
	methods: {
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
.options {
   padding-left : 0px;
   list-style-type : none;
}
.option-display {
   padding-top: 0.2em;
}
.correct-option {
   color:#1867c0;
   font-size : 1.6em; 
}
</style>