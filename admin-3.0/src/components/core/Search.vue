<template>
   <form @submit.prevent="submit">
      <v-text-field :label="label"
      prepend-icon="mdi-magnify"
      append-icon="mdi-close"
      v-model="val"
      @click:append="clear"
      />
   </form>
</template>

<script>
export default {
   name: 'CoreSearch',
   props: {
      label: {
			type: String,
			default: '搜尋'
      },
      keyword: {
			type: String,
			default: ''
      }
   },
   data () {
      return {
         val: ''
      }
   },
   beforeMount() {
      this.val = this.keyword;
   },
   methods: {
      submit() {
         this.$emit('submit', this.val);
      },
      clear() {
         this.val = '';
         this.submit();
      }
   }
}
</script>