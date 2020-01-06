<template>
<div>
<term-selector ref="termSelector" 
	:subject_id="params.subject" :selected_ids="term.ids"
	@submit="onTermSelected"
	>
		
	</term-selector>

   
</div>
</template>

<script>
export default {
   name: 'SubDashboard',
   data() {
      return {
         params: {
            subject: 3,
				term: '37,38',
				recruits: ''
         },

         term: {
            ids: [37,38]
         }
      }
   },
   beforeMount() {
      
   },
   mounted() {
      this.$refs.termSelector.init();
   },
   methods: {
      create() {

      },
      onTermSelected(model) {
          console.log('onTermSelected', model);
          
      }
   }
}
</script>