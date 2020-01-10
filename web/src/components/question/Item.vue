<template>
<v-row>
	<v-col>
		<v-radio-group v-model="radioGroup">
			<p>
				<v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
				<v-icon color="error" class="mr-1">mdi-close-circle</v-icon>
				<span v-show="index" class="mr-1">{{ index }}.</span>
				郝贵生：共产党人的“斗争精神”当代斗争内容究竟是什么？
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
		<v-expansion-panels>
			<v-expansion-panel v-for="(item,i) in 3" :key="i">
      		<v-expansion-panel-header>解析</v-expansion-panel-header>
				<v-expansion-panel-content>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</v-expansion-panel-content>
    		</v-expansion-panel>
  		</v-expansion-panels>
	</v-col>
</v-row> 
</template>

<script>

export default {
	name: 'QuestionRead',
	props: {
		index: {
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
         panel: 0
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