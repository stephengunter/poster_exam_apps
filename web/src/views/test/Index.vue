<template>
	<v-container>
		<manual-item :model="model" />
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmptyObject } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {
			model: {
				title: '測驗模式',
				summary: '針對歷屆試題進行模擬測驗，判斷你的得分實力與錄取標準的差距',
				content:`<p>
<img class="article-img" src="https://pvwc0w.ch.files.1drv.com/y4mO4YgsTzLTITOWNyVDUqhqeBIc0ZOhn4Yx9dkgcSYjFVuiy-6PkVs1Qp7jpqDYBjTwcJR6YKQTMQFTFq11ZhfxmAE-cCi_wLpYoSzifliR9dl3eJmN55BjhH0zrc6xYIH0h4fR6h1pKWxMSx_PWHPbqWvijFpE5G3QUocVk_yyt3Hxezm-97XqnSG4PdLrV3UrL-jvuAn5G5DuiebGYvQoQ?width=358&height=589&cropmode=none" />
     
   <ul class="article-imgDesc" style="list-style:none;padding:0;margin:0;">
      <li >
         <img src="http://localhost:8080/images/one-red.png" class="inline-emoji" />
         叫出功能選單按鈕
      </li>
      <li >
         <img src="http://localhost:8080/images/two.png" class="inline-emoji" />
         功能選單
      </li>
   </ul>
</p>`,
				features: [{
					key: 'rq-exam-summary', title: '作答概況',
					summary: '顯示已作答與未作答的題號',
					content: `<p>
<img class="article-img" src="https://8qzfog.ch.files.1drv.com/y4m5JO_hPBuxYp4h58UfODkL2VOV5UqaoutXbPMzYnV_H8vscBAZlLMfz2MNKWNIUpu4f4YvAYaGYLGCrncY3PDrD2Tc8_jZk106Fucr3wy4Ke8C3wJ9gXh49hg6mC2b_s6P0o_Cp2OLHuJK6Ppg5XUuB-5nFZGEJDsyawzSU0wSIjF9WkiYXnCw4p2REjjNuPD-Ncrt8ixbrvxKIKpOqS_1w?width=360&height=416&cropmode=none" />
     
   <ul class="article-imgDesc" style="list-style:none;padding:0;margin:0;">
      <li >
         點擊題號會直接跳到該題目
      </li>
   </ul>
</p>`
				},{
					key: 'rq-exam-save', title: '存檔',
					summary: '沒時間作完時，將測驗存檔，下次打開繼續作答',
					content: `<p>
<img class="article-img" src="https://8vzfog.ch.files.1drv.com/y4mN25ePXLjmkLCQOv_etSYxgRhmspmv4BK-vAT3m6KhoDz9YnavKwsha_Iz3WFsItlLp5RYgCfgVqKA1jbVy7k-IkhEb8GVKvn_lRzzRUvtrY3OU-VfRpCU0I6Kv7Al2qOCdg-Ifot60ztTi9pbBUNpb1VsinzbovQTFOZ23Pqj6W46I4tgMsYs3_OTJ05HhxjKLMLAFIvQXgdAHnpTBYTEA?width=359&height=535&cropmode=none" />
     
   <ul class="article-imgDesc" style="list-style:none;padding:0;margin:0;">
      <li >
         存檔名稱可以自訂
      </li>
   </ul>
</p>`
				},{
					key: 'rq-exam-done', title: '交券',
					summary: '作答完畢，交券後系統將進行存檔與評分',
					content: `<p>
<img class="article-img" src="https://8fzfog.ch.files.1drv.com/y4msd1eXnFKLl1gvOfFAG3B70G6jvmVQAu4NnnAf17l_TGWCW19JpAjhOGd7nO1gzIc9n-qteNxebno0tyqeqQEHPfvoJ-rwUxwQS6iJWgJgcdr7pULmMyESktw75FBzVuCIh8mQW0T4nPLlcSBxS05HrHei5gbTNe-_HOQ01nDgIjkhkhghhn8izkj2DGoFvgQdC9zqIaoKLa6CFgyl-6coA?width=360&height=537&cropmode=none" />
   <br>
	交券後，可看到正確答案與閱讀解析。 <br>
	詳細說明請 <a href="#">點此查看</a>
</p>`
				}],
			}
		}
	},
	computed: {
		
	},
	beforeMount() {
		let query = this.$route.query;
		if(query && !isEmptyObject(query)) {
			for (let field in this.params) {
				if(query.hasOwnProperty(field)) {
					this.params[field] = query[field]
				}
			}
		}

		console.log('beforeMount', this.params);
		
	},
	methods: {
		test() {
			this.$router.push({ path: '/test/details' });
			
			
		}
	},
	

}
</script>


