<template>
	<v-container class="fill-height" fluid>
		<v-row>
			<v-col>
				模式：歷屆試題 > 108年度
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				得分：<span class="headline" style="color: #4caf50">82</span>
				<span class="ml-3 date">(2019/12/26 16:36)</span>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<h2>專業科目(2) 郵政法規大意及交通安全常識</h2>
				<h5>
					四選一單選選擇題共 50 題，每題 2 分
				</h5>
			</v-col>
		</v-row>
		<ExamItem />
		
	</v-container>
</template>

<script>
import ExamItem from '@/components/exam/Item';
export default {
	name: 'ExamView',
	components: {
		ExamItem
	}
}
</script>

<style scoped>
.date {
	font-size: 0.8em;
}
</style>
