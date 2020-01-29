<template>
<v-row :id="element_id">
	<v-col>
			<p class="q-title">
				<span class="mr-1">{{ model.index }}.</span>
				{{ model.title }}
			</p>
			<option-list :options="model.options" 
			@show-photo="showPhoto" 
			/>
		<v-expansion-panels style="margin-top:1em" v-show="model.resolves.length">
			<v-expansion-panel @click="showResolves" >
      		<v-expansion-panel-header >
					<a v-show="!expansion" href="#" @click.prevent="() => {}" style="text-decoration: none;" >解析</a>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<resolve-item v-for="resolve in model.resolves" :key="resolve.id" 
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
export default {
	name: 'QuestionItem',
	props: {
		element_id: {
         type: String,
         default: ''
		},
		model: {
         type: Object,
         default: null
      },
	},
	data(){
      return {
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