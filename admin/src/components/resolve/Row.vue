<template>
   <tr>
      <td>
         <v-textarea v-model="model.text" label="內容" outlined auto-grow
         v-validate="'required'"
         :error-messages="getErrMsg('text')"
         name="text"
         rows="5"
         row-height="15"
         />
      </td>
      <td>
         <v-textarea v-model="model.highlight" label="重點標記" outlined auto-grow
         name="text"
         rows="5"
         row-height="15"
         />
      </td>
      <td>
         <v-textarea v-model="model.source" label="資料來源" outlined auto-grow
         name="text"
         rows="5"
         row-height="15"
         />
      </td>
      <td v-if="enable">
         <v-btn v-if="edit" @click.prevent="save" small  flat icon color="success">
            <v-icon>mdi-content-save</v-icon>
         </v-btn>
         <v-btn v-else @click.prevent="select" small  flat icon color="success">
            <v-icon>mdi-pencil</v-icon>
         </v-btn>

         <v-btn @click.prevent="remove" small  flat icon color="error">
            <v-icon>mdi-delete-circle</v-icon>
         </v-btn>
      </td>
      <td v-else>
         
      </td>
   </tr>
  
</template>

<script>
export default {
   name: 'ResolveRow',
   props: {
      model: {
         type: Object,
         default: null
      },
      edit: {
         type: Boolean,
         default: false
      },
      enable: {
         type: Boolean,
         default: false
      }
   },
   methods: {
      save() {
         this.$validator.validate().then(valid => {
				if(valid) this.$emit('save');
			});
      },
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('text', '內容');
			}
			return '';
      },
      select() {
         this.$emit('edit');
      },
      remove() {
         this.$emit('remove');
      }
   }
}
</script>

<style>

</style>