<template>
   <v-card>
      <v-card-title>
         <span class="headline">Id : {{ model.id }}</span>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
            <v-icon>mdi-window-close</v-icon>
         </v-btn>
      </v-card-title>
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="12">
                  <v-img class="img-center" :src="model.id | photoIdUrl"
                  :max-width="model.width"
                  />
               </v-col>
               <v-col cols="12">
                  <v-text-field single-line hide-details :value="model.previewPath" readonly>
                     <template v-slot:append>
                        <v-btn icon v-clipboard:copy="model.previewPath" v-clipboard:success="onCopySuccess">
                           <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                     </template>
                  </v-text-field>
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <v-card-actions>
         <v-container>
            <v-row>
               <v-col cols="6">
                  
               </v-col>
               <v-col cols="6" class="text-right">
                  <v-btn @click.prevent="remove" color="error">
                  刪除
                  </v-btn>
               </v-col>
            </v-row>
            
         </v-container>
      </v-card-actions>
   </v-card>
</template>

<script>

import { DELETE_ATTACHMENT } from '@/store/actions.type';
export default {
   name: 'AttachmentEdit',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   data () {
      return {
         
      }
   },
   methods: {
      onCopySuccess() {
			Bus.$emit('success', 'Copy Success');
		},
      cancel() {
         this.$emit('cancel');   
      },
      remove() {
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
		},
      submitDelete(){
			let id = this.model.id;
			this.$store.dispatch(DELETE_ATTACHMENT, id)
			.then(() => {
				this.$emit('saved');
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		}
   }
}
</script>

<style>

</style>