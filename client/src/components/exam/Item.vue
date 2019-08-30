<template>
<div>
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
	<v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header>解析</v-expansion-panel-header>
        <v-expansion-panel-content>
          Some content
        </v-expansion-panel-content>
      </v-expansion-panel>
   </v-expansion-panels>
</div>  
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
