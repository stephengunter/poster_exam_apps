<template>
   <div>
      <h2>
         專業科目(2) 郵政法規大意及交通安全常識
      </h2>
      <h5>
         四選一單選選擇題共 50 題，每題 2 分
      </h5>
      <h2>得分：<span class="headline" style="color: #4caf50">82</span>
      </h2>
     
     
      
      <ExamItem />
   </div>
</template>

<script>

import ExamItem from '@/components/exam/Item';

export default {
   name: 'ExamView',
   components: {
      ExamItem
   },
   data(){
      return {
         fab: false,
      hidden: false,
      tabs: null,
      }
   },
   computed: {
      activeFab () {
        switch (this.tabs) {
          case 'one': return { color: 'success', icon: 'share' }
          case 'two': return { color: 'red', icon: 'edit' }
          case 'three': return { color: 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      },
    },
};
</script>