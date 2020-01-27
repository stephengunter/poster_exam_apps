<template>
   <div>
      <span class="font-weight-thin">{{ title }}</span>
      <p v-if="html" v-html="text" class="font-weight-bold" style="font-size:16px">
      </p>
      <p v-else class="font-weight-bold" style="font-size:16px">
         {{ text }}
         <slot>
            
         </slot>
         
      </p>
   </div>
</template>

<script>
export default {
   props: ['title', 'text', 'html']
}
</script>

<style>

</style>