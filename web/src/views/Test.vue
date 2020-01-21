<template>
	<v-container >
		
	</v-container>
</template>

<script>
export default {
	name: 'TestView',
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


