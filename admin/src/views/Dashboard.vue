<template>
<div>
   
</div>
</template>

<script>
import { FETCH_SUBJECTS, FETCH_TERMS } from '@/store/actions.type';
export default {
   name: 'Dashboard',
   data() {
      return {
         allow_cancel: true,
         params: {
            subject: 0,
				term: 0
         },
         subject: {
				options: [],
				root: null,
				subItems: []
			},
      }
   },
   computed: {
		canCreate(){
			return true;
		},
   },
   beforeMount(){
      //只要root科目(考試科目)
		this.$store.dispatch(FETCH_SUBJECTS, { parent: 0, subItems: true })
		.then(subjects => {
			let subjectOptions = subjects.map(item => ({
				value: item.id, text: item.title
         }));
         
         this.subject.options = subjectOptions;
			this.params.subject = subjectOptions[0].value;

			this.onSubjectChanged(this.params.subject);
		})
		.catch(error => {
			onError(error);
		})
   },
   methods: {
      init() {

      },
      onParamsChanged() {
         console.log('onParamsChanged');
      },
      onSubjectChanged(val) {
			let subject = this.subjectList.find(item => item.id === val);
		
			this.subjects = subject.subItems.slice(0);
			let vm = this;
			fetchTerms(subject.subItems.map(item => item.id), vm);

			this.rootSubject = subject;
		},
      create() {

      },
      cancel() {

      }
   }
   
}
</script>
