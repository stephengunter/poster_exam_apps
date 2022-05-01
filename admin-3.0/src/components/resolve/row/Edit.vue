<template>
   <tr>
      <td style="padding: 10px 16px;">
         <core-upload-button v-show="!hasSources" class_name="mb-3" 
         color="default" :multiple="true"
         @file-added="onFileAdded"
         >
            附圖<v-icon right dark>mdi-image</v-icon>
         </core-upload-button>

         <div v-for="(item, index) in attachments" :key="index">
            <v-img :src="getPhotoPath(item)"  max-width="100" aspect-ratio="1">
               <core-close-icon-button color="success"
               @close="removeAttachment(index)"
               />
            </v-img>
            <v-text-field style="padding-top: 1px; margin-top: 1px; max-width: 120px" v-model="item.title" />
         </div>
      </td>
      <td style="padding: 10px 16px;">
         
         <source-item v-for="(item, index) in model.sources"  :key="index"
         :model="item"
         />

         <validation-provider v-if="!hasSources" v-slot="{ errors }" name="內容">
            <v-textarea v-model="model.text" label="內容" auto-grow
            rows="5" row-height="15"
            :error-messages="errors"
            />
         </validation-provider>

      </td>
      <td style="padding: 10px 16px;">
         <v-textarea v-model="model.highlight" label="重點標記" auto-grow v-show="!hasSources"
         name="text"
         rows="5"
         row-height="15"
         />
      </td>
      <td>
         <source-selector :subject_id="question.subjectId" :sources="model.sources"
         @changed="onSourceChanged"       
         />
      </td>
      <td v-if="enable">
         <v-btn @click.prevent="save" small icon color="success">
            <v-icon>mdi-content-save</v-icon>
         </v-btn>

         <v-btn @click.prevent="cancel" small icon >
            <v-icon>mdi-reply</v-icon>
         </v-btn>
      </td>
      <td v-else>
         
      </td>
   </tr>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ADD_MEDIA, REMOVE_MEDIA } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { addErrorMsg, getErrorMsg, clearErrors, photoNameUrl, replaceBR } from '@/utils';

export default {
   name: 'ResolveRowEdit',
   props: {
      question: {
         type: Object,
         default: null
		},
      index: {
         type: Number,
         default: 0
      },
      model: {
         type: Object,
         default: null
      },
      enable: {
         type: Boolean,
         default: false
      }
   },
   data () {
		return {
         
		}
   },
   computed: {
      ...mapState({
			medias: state => state.medias.medias,
			attachments: state => state.medias.attachments,
		}),
      hasSources() {
         if(!this.model) return false;
         return this.model.sources.length > 0;
      }
   },
   methods: {
      getPhotoPath(attachment) {
         let width = 100;
         if(attachment.previewPath) return photoNameUrl(attachment.previewPath, width);
         else {
            let media = this.medias.find(item => item.file.name === attachment.name);
            return media.thumb.data;
         }
      },
      removeAttachment(index) {
         this.$store.dispatch(REMOVE_MEDIA, index);
      },
      onFileAdded({ files, thumbs }) {
         this.$store.dispatch(ADD_MEDIA, { files, thumbs });
         this.$nextTick(() => {
            this.$emit('content-changed');
         });
      },
      onSourceChanged() {
         this.$emit('content-changed');
      },
      save() {
         this.$emit('save');
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
