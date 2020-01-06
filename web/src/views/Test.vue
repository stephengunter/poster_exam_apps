<template>
	<v-container>
		<v-card>
			<v-card-title>
				<h3>歷屆試題</h3>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12">
						<v-radio-group v-model="mode">
							<v-radio label="閱讀(顯示答案)" value="read" />
							<v-radio label="模擬測驗" value="exam" />
						</v-radio-group>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="4">
						<v-select
							:items="years"
							label="年度"
						/>
					</v-col>
					<v-col cols="12" md="8">
						<v-select
							:items="years"
							label="科目"
						/>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				
				<v-btn
					color="green darken-1"
					text
				>
					確定
				</v-btn>
			</v-card-actions>
      </v-card>	

	</v-container>
</template>

<script>
export default {
	name: 'TestView',
	data() {
		return {
			mode: 'read',
			years:[{value: 1, text: '108年度'}]
		}
	},
	beforeMount() {
		
	},
	methods: {
		test() {
			
		}
	}
}
</script>
