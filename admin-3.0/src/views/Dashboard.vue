<template>
   <core-container>
      <table class="custom-table">
   <tr>
      <th>
         核一廠
      </th>
      <td>
         <ul>
            <li>
               位置：新北市石門區
            </li>
             <li>
               商轉日期：
               <ul>
                  <li>
                     一號機：67年12月
                  </li>
                   <li>
                     二號機：68年07月
                  </li>
               </ul>   
            </li>
            <li>
               役期屆滿日期：
               <ul>
                  <li>
                     一號機：107年12月
                  </li>
                   <li>
                     二號機：108年07月
                  </li>
               </ul>   
            </li>
           
         </ul>
      </td>
   </tr>
   <tr>
      <th>
         核二廠
      </th>
      <td>
         <ul>
            <li>
               位置：新北市萬里區
            </li>
             <li>
               商轉日期：
               <ul>
                  <li>
                     一號機：70年12月
                  </li>
                   <li>
                     二號機：72年03月
                  </li>
               </ul>   
            </li>
            <li>
               役期屆滿日期：
               <ul>
                  <li>
                     一號機：110年12月
                  </li>
                   <li>
                     二號機：112年03月	
                  </li>
               </ul>   
            </li>
           
         </ul>
      </td>
   </tr>
   <tr>
      <th>
         核三廠
      </th>
      <td>
         <ul>
            <li>
               位置：屏東縣恆春鎮
            </li>
             <li>
               商轉日期：
               <ul>
                  <li>
                     一號機：73年07月
                  </li>
                   <li>
                     二號機：74年05月
                  </li>
               </ul>   
            </li>
            <li>
               役期屆滿日期：
               <ul>
                  <li>
                     一號機：113年07月	
                  </li>
                   <li>
                     二號機：114年05月
                  </li>
               </ul>   
            </li>
           
         </ul>
      </td>
   </tr>
   <tr>
      <th>
         龍門廠(原定核四廠)
      </th>
      <td>
         <ul>
            <li>
               位置：屏東縣恆春鎮
            </li>
            <li>
               已封存
            </li>
         </ul>
      </td>
   </tr>
</table>

<v-img class="mt-2" :src="media.previewPath | photoNameUrl(100)" 
max-width="100" aspect-ratio="1"
/>
<span>分布圖</span>

   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_QUESTIONS } from '@/store/actions.type';
import { SET_TERMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, findSubject } from '@/utils';

export default {
   name: 'DashboardView',
   data () {
      return {
         media: {
            previewPath: '20211027/d4a744e3-5df5-4dd5-9cb7-38ddc0a4e6d6.jpg',

         }
      }
   },
   computed: {
     
	},
   beforeMount() {
      
   },
   mounted() {
		
	},
   methods: {
      
   }
}
</script>

<style>

</style>