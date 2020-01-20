<template>
<div>
   <input style="width:300px" v-model="originalUrl">
   <button @click="test">Test</button>
</div>
</template>

<script>
const validUrl = require('valid-url');
export default {
   name: 'Dashboard',
   data() {
      return {
         url: '',
         originalUrl: '',
         shortBaseUrl: 'http://postexam.com.tw'
      }
   },
   beforeRouteEnter (to, from, next) {
		console.log('beforeRouteEnter');
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate (to, from, next) {
	  console.log('beforeRouteUpdate');
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
  },
  beforeRouteLeave(to,from,next){//离开组件的时候触发
            //什么都不写的时候，不会离开(走下一步)
            next(false)
        },
   methods: {
      test(){
         if (validUrl.isUri(this.shortBaseUrl)) {
            console.log('ok');
         } else {
            alert('damn');
         }
      }
   }
   
}
</script>
