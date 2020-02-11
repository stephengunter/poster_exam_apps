<template>
<div>
   <table class="custom-table">
      <tr>
         <th></th>
         <th>臨時停車</th>
         <th>停車</th>
      </tr>
      <tr>
         <td>汽車</td>
         <td>距離路面邊緣60公分內(大型車為1公尺內)</td>
         <td>距離路面邊緣40公分內</td>
      </tr>
      <tr>
         <td>機車</td>
         <td>距離路面邊緣40公分內</td>
         <td>距離路面邊緣30公分內</td>
      </tr>
   </table>
 <h3>
    發生道路交通事故，應在適當距離處豎立車輛故障標誌或其他明顯警告設施：
 </h3>
  
   <table class="custom-table">
      <tr>
         <th style="width:50%">高速公路</th>
         <td>事故地點後方 100 公尺處</td>
      </tr>
      <tr>
         <th>快速道路或速限超過60公里</th>
         <td>事故地點後方 80 公尺處</td>
      </tr>
      <tr>
         <th>速限50至60公里</th>
         <td>事故地點後方 50 公尺處</td>
      </tr>
      <tr>
         <th>速限50公里以下</th>
         <td>事故地點後方 30 公尺處</td>
      </tr>
      <tr>
         <th>交通壅塞或行車時速低於10公里</th>
         <td>事故地點後方 5 公尺處</td>
      </tr>
   </table>
   <h3>
    交通事故案件當事人或利害關係人，得向警察機關申請閱覽或提供相關資料：
 </h3>
   <table class="custom-table">
      <tr>
         <th style="width:50%">事故現場</th>
         <td>當事人登記聯單</td>
      </tr>
      <tr>
         <th>事故七日後</th>
         <td>現場圖、現場照片</td>
      </tr>
      <tr>
         <th>三十日後</th>
         <td>交通事故初步分析研判表</td>
      </tr>
   </table>
</div>
</template>

<script>
export default {
   name: 'Dashboard',
   data() {
      return {
         
      }
   },
   computed: {
		canCreate(){
			return true;
		},
   },
   beforeMount(){
      
   },
   methods: {
      init() {

      },
   }
   
}
</script>
