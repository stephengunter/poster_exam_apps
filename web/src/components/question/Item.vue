<template>
<v-row>
	<v-col>
		<div>
			<p class="q-title">
				<span v-show="order" class="mr-1">{{ order }}.</span>
				{{ model.title }}
			</p>
			<OptionList :options="model.options" 
			@show-photo="showPhoto" 
			/>
		</div>
		<v-expansion-panels style="margin-top:1em" v-show="model.resolves.length">
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
import OptionList from '@/components/option/List';
export default {
	name: 'QuestionItem',
	components: {
		ResolveItem,
		OptionList
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