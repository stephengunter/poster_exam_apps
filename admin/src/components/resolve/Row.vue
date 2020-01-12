<template>
   <tr v-if="edit">
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
         index: {{ index }}
         enable: {{ enable }}
         edit: {{ edit }}
         <!-- <v-textarea v-model="model.source" label="資料來源" outlined auto-grow
         name="text"
         rows="5"
         row-height="15"
         /> -->
      </td>
      <td v-if="enable">
         <v-btn @click.prevent="save" small  flat icon color="success">
            <v-icon>mdi-content-save</v-icon>
         </v-btn>
 
         <v-btn @click.prevent="cancel" small flat icon >
            <v-icon>mdi-reply</v-icon>
         </v-btn>
      </td>
      <td v-else>
         
      </td>
   </tr>
   <tr v-else>
      <td>
         {{ model.text }}
      </td>
      <td>
         {{ model.highlight }}
      </td>
      <td>
          index: {{ index }}
         enable: {{ enable }}
         edit: {{ edit }}
      </td>
      <td v-if="enable">
        
         <v-btn @click.prevent="select" small  flat icon color="success">
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
      index: {
         type: Number,
         default: 0
      },
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
         this.$emit('selected', this.index);
      },
      cancel() {
         this.$emit('cancel');
      },
      remove() {
         this.$emit('remove', this.index);
      }
   }
}
</script>

<style>

</style>