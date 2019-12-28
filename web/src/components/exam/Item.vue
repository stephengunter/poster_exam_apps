<template>
<v-row>
	<v-col>
		<v-radio-group v-model="radioGroup">
			<p>
				<v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
				<v-icon color="error" class="mr-1">mdi-close-circle</v-icon>
				<span class="mr-1">1.</span>
				郝贵生：共产党人的“斗争精神”当代斗争内容究竟是什么？
			</p>
			<v-radio readonly
			v-for="n in 3"
			:key="n"
			:label="`Radio ${n}`"
			:value="n"
			/>
			<v-radio value="Duckduckgo" readonly>
				<template v-slot:label>
					<div>
						<strong class="error--text">Duckduckgo</strong>
					</div>
				</template>
			</v-radio>
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
	name: 'ExamItem',
	data(){
      return {
		  radioGroup: 1,
		  panel: 0
      }
   }
};
</script>
