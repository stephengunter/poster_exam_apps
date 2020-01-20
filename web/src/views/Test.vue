<template>
	<v-container >
		<v-card>
			<v-card-text>
				<v-row>
					<v-col cols="6">
						<LabelText title="存檔名稱" text="存檔名稱" />
						
						
					</v-col>
					<v-col cols="6">
						<span class="font-weight-thin">最後更新</span>
						<p class="font-weight-bold" style="font-size:16px">
							存檔名稱
						</p>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<span class="font-weight-thin">科目</span>
						<p class="font-weight-bold q-title" >
							存檔名稱
						</p>
					</v-col>
					<v-col cols="6">
						<span class="font-weight-thin">最後更新</span>
						<p class="font-weight-bold" style="font-size:16px">
							存檔名稱
						</p>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-btn color="error">刪除</v-btn>
				<v-spacer />
				<v-btn color="success">繼續作答</v-btn>
			</v-card-actions>
		</v-card>

	</v-container>
</template>

<script>
import LabelText from '@/components/core/LabelAndText';
export default {
	name: 'TestView',
	components: {
		LabelText
	},
	data() {
		return {
			mode: 'read',
			years:[{value: 1, text: '108年度'}]
		}
	},
   beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
},
	methods: {
		test() {
			
		}
	},
	

}
</script>


