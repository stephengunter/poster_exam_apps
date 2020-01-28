<template>
   <span v-if="score < 75" style="color:red; font-size:22px">
       {{ score >= 0 ? score : '' }}
   </span>
   <span v-else style="color:green; font-size:22px">
       {{ score }}
   </span>
</template>

<script>
export default {
   props: {
      score: {
         type: Number,
         default: 0
      }
   },
}
</script>

<style>

</style>