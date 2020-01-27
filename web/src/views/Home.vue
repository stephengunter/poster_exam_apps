<template>
	<v-container>
		<v-row>
			<v-col>
				<p class="q-title">
					<v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
					<v-icon color="error" class="mr-1">mdi-close-circle</v-icon>
					<span class="mr-1">1.</span>
					郝贵生：共产党人的“斗争精神”当代斗争内容究竟是什么？
				</p>
				<v-radio-group v-model="radioGroup" readonly>
					<v-radio 
					v-for="n in 3"
					:key="n"
					:label="`Radio ${n}`"
					:value="n"
					>
					<template v-slot:label>
						当代斗争内容究竟是什么当代斗争内容究竟是什么当代斗争内容究竟是什么当代斗争内容究竟是什么
						<a href="#"><img src="https://localhost:44349/api/photo?name=20200109/cdda6a14-9deb-4e9c-ba4a-9000d71469ba.png&amp;width=120" style="vertical-align: middle;"></a>
					</template>
					</v-radio>
					<v-radio value="Duckduckgo" >
						<template v-slot:label>
							<div>
								<strong class="success--text">Duckduckgo</strong>
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
	</v-container>
</template>

<script>
export default {
	name: 'HomeView',
	data() {
		return {
			radioGroup: 1,
		}
	},
	created(){
		
	},
	beforeMount() {
	},
	methods: {

	}
}
</script>
