<template>
   <v-card v-if="model">
      <v-card-title>測驗存檔</v-card-title>
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="12">
                  <v-textarea v-model="model.title" label="存檔名稱" outlined auto-grow
                  v-validate="{ required: true }"
                  :error-messages="getErrMsg('title')"
                  name="title"
                  required
                  :rows="responsive ? 5 : 2"
                  row-height="15"
                  />
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <v-card-actions >
         <v-spacer></v-spacer>
         <v-btn @click="cancel">
            取消
         </v-btn>
         <v-btn color="success" @click="submit">
            確定
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'ExamSave',
   props: {
      model: {
         type: Object,
         default: null
      },
      on_ok: {
         type: Function,
         default: null
      }
   },
   computed: {
      ...mapGetters(['responsive']),
   },
   methods: {
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '存檔名稱');
			}
			return '';
      },
      cancel() {
         this.$emit('cancel');
      },
      submit() {
         this.$validator.validate().then(valid => {
            if(valid) {
               if(this.on_ok) this.on_ok();
               else this.$emit('save');
            }
         });
      }
   }
}
</script>