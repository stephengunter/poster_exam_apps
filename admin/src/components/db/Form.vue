<template>
<form @submit.prevent="onSubmit">
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs12>
               <v-text-field v-model="model.key" label="Key"
               v-validate="'required'"
               :error-messages="getErrMsg('key')"
               name="key"
               required
               />
            </v-flex>
         </v-layout>
      </v-card-text>
      <v-card-actions>
         <v-spacer />
         <v-btn @click.prevent="onSubmit" color="primary">確定</v-btn>
      </v-card-actions>
   </v-card>
</form>
</template>

<script>
export default {
   name: 'DBForm',
   props: {
      title: {
         type: String,
         default: ''
      },
      model: {
         type: Object,
         default: null
		}
   },
   methods: {
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg;
			}
			return '';
      },
      onSubmit() {
         this.$validator.validate().then(valid => {
            if(valid)  this.$emit('submit');
         }); 
      },
      cancel() {
         this.errors.clear();
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>