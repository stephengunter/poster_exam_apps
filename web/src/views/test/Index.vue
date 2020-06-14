<template>
	<v-container>
		<v-row>
			<v-col>
				<v-select :items="options" @change="test"
        		/>
			</v-col>
		</v-row>
		
		<v-card v-for="(item, index) in items" :key="index" :id="`man_${index}`" style="margin-top:20px;">
			<v-card-title>
				<h3>{{ index }}</h3>
			</v-card-title>
			<v-card-text style="font-size: 1rem;">
				<article v-html="item">
					
				</article>
			</v-card-text>
			
		</v-card>
		
	</v-container>
</template>

<script>
import scrollIntoView from 'scroll-into-view';
import { mapState, mapGetters } from 'vuex';
import { isEmptyObject } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {
			options: [],
			items: [],
			content: `
				<p>
					观察者网讯）据国家卫健委13日上午最新通报，6月12日北京新增本土确诊病例6例。这也就意味着，6月11日至12日两天内，北京新增本土确诊病例7例。

北京市疾控中心副主任庞星火13日表示，这些确诊病例均有新发地农产品批发市场活动史。此外，在新发地采集的517件样品中，有45人咽拭子阳性，另在海淀一农贸市场中发现1例阳性，是1例新发地确诊病例的密切接触者。

目前，作为北京重要“菜篮子”的新发地批发市场已成为流调溯源的重中之重。12日晚，北京市委、市政府已约谈丰台区委、区政府主要负责同志，要求向新发地批发市场派驻工作组。

丰台区区长初军威13日表示，丰台区迅速启动战时机制，成立现场指挥部，已对新发地市场及周边11个小区采取封闭管理措施，市场周边3所小学、6所幼儿园已返校的班级立即停课。

北京市卫健委新闻发言人高小俊介绍，北京将对5月30日以来与新发地市场有密切接触的人员开展核酸检测。

与此同时，自13日3时起新发地批发市场暂时休市。另据北京市交通委员会消息，京开高速出京方向新发地出口（K6）采取临时交通管制措施。
				</p>
			`
		}
	},
	computed: {
		
	},
	beforeMount() {
		//console.log('scrollIntoView', scrollIntoView);
		for(let i = 0; i < 10; i++) {
			this.items.push(this.content);
			this.options.push({
				value: i, text: i
			})
		}
		
	},
	methods: {
		test(val) {
			var element = document.getElementById(`man_${val}`);
			if(!element) return;
			scrollIntoView(element, {
				time: 500
			}, (type) => {
				console.log('type', type);
			});
			//element.scrollIntoView(true);
			
			// setTimeout(() => {
			// 	window.scrollBy(0, 60)
			// }, 500);
		}
	},
	

}
</script>


