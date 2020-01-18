<template>
   <v-card>
      <v-card-title v-if="title">{{ title }}</v-card-title>
      <v-card-text v-if="text">
         {{ text }}
      </v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn  text @click="cancel">
            {{ cancel_text }}
         </v-btn>
         <v-btn  color="green darken-1" text @click="ok">
            {{ ok_text }}
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'CoreConfirmation',
   props: {
      title: {
         type: String,
         default: ''
		},
      text: {
         type: String,
         default: ''
      },
      ok_text: {
         type: String,
         default: '確定'
      },
      cancel_text: {
         type: String,
         default: '取消'
      }
   },
   methods: {
      ok() {
         this.$emit('ok');
      },
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>