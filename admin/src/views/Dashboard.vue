<template>
<div>
   <ul class="services-list">
   <li>
   <a href="https://www.google.com" class="image">
      <img src="http://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_square-24.png" alt="Facebook Icon" />
   </a>
   <div class="content">
      <h3>Header</h3>
      <p>text goes here</p>
   </div>
   </li>
   <li>
   <a href="https://www.google.com" class="image">
      <img src="http://cdn1.iconfinder.com/data/icons/socialmediaicons_v120/24/facebook.png" alt="Facebook Icon" />
   </a>
   <div class="content">
   <h3>Header</h3>
   <p>text goes here</p>
   </div>
   </li>
   </ul>
</div>
</template>

<script>
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         photo: null,
         thumb: null
      }
   },
   computed: {

   },
   beforeMount() {
      
   },
   methods: {
      
   }
   
}
</script>

<style scoped>
.service-list {
list-style-type: none;
margin-left:0px;
padding-left:0px;
display: inline-block;
}

.service-list img
{
float:left;
}

.service-list p,h3 {
text-align: right; 
display:inline-block;
padding: 0;
}
</style>