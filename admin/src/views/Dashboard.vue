<template>
<div>
   <recruit-selector ref="recruitSelector"
		:title="recruit.title" :selected_ids="recruit.ids"
      :recruits="recruitList" :subject="subject"
		@cancel="recruits.selecting = false" @submit="onSubmitRecruits"
	/>

</div>
</template>

<script>
import { FETCH_SUBJECTS, FETCH_RECRUITS } from '@/store/actions.type';
import { hasIntersection, onError } from '@/utils';
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         params: {
            subjectId: 1,
            recruits: '24'
         },

         subject: null,

         recruitList: [],

         recruit: {
            ids: [],
            title: '考古題'
         },
         
      }
   },
   computed: {

   },
   beforeMount() {
      this.$store.dispatch(FETCH_SUBJECTS)
		.then(subjects => {
         let subjectId = this.params.subjectId;
         this.subject = subjects.find(item => item.id === subjectId);
         
         setTimeout(() => {
				this.initRecruits();
			}, 500)
			
		})
		.catch(error => {
			onError(error);
      })
      
      
   },
   methods: {
      initRecruits() {
         console.log('subject', this.subject);
         this.$store.dispatch(FETCH_RECRUITS)
         .then(recruits => {
            this.recruitList = recruits;
            
            console.log('recruitList', recruits);
            
            let selectedIds = [];

            if(this.params.recruits) {
               selectedIds = this.params.recruits.split(',').map(id => parseInt(id));
            }
            
            console.log('selectedIds', selectedIds);
            this.recruit.ids = selectedIds;

            setTimeout(() => {
               this.$refs.recruitSelector.init();
            }, 500)
            
         })
         .catch(error => {
            onError(error);
         })
      },
      onSubmitRecruits(model) {
         console.log('onSubmitRecruits', model);
      },
      onRecruitSelected(index) {
         this.recruit.selectingIndex = index;
         this.recruit.selecting = true;

         let models = this.recruit.models;
         let selectedModel = models[index];
         


      },
      selectRecruit(index = 0) {
			this.onRecruitSelected(index);
         
         let models = this.recruit.models;

			let selectedModel = models[index];
         if(selectedModel) this.params.term = selectedModel.id;
         setTimeout(() => {
            this.$refs.termSelector.init(false);
         }, 500);
			
		},
   }
   
}
</script>