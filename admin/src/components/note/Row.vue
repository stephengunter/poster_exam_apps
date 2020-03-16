<template>
   <tr class="row-note" v-if="edit">
      <td>
         {{ model.id }}
      </td>
      <td>
         <v-text-field v-model="model.order"
         />
      </td>
      <td>
         <core-upload-button :multiple="true"
         @file-added="onFileAdded" @loading="medias.loading = true"
         @cancel="hideUpload"
         >
            附圖<v-icon right dark>mdi-image</v-icon>
         </core-upload-button>

         <div v-for="(item, index) in model.attachments" :key="index">
            <v-img  :src="getPhotoPath(item)"  max-width="100" aspect-ratio="1">
               <v-btn color="success" style="margin:0;position:absolute;top:0;right:0;width:30px;height:30px;" flat icon
               @click="removeAttachment(index)"
               >
                  <v-icon>mdi-close-circle-outline</v-icon>
               </v-btn>
            </v-img>
            <input v-model="item.title" type="text">
         </div>
      </td>
      <td>
         <v-text-field v-model="model.title"
         />
      </td>
      <td>
         <v-textarea v-model="model.text" label="內容" outlined auto-grow
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
         <v-textarea v-model="model.reference" label="參考條文" outlined auto-grow
         name="text"
         rows="5"
         row-height="15"
         :error-messages="getErrMsg('reference')"
         />
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
   <tr class="row-note" v-else>
      <td>
         {{ model.id }}
      </td>
      <td>
         <v-icon v-if="model.active" color="success" style="vertical-align: baseline;">
            mdi-check-circle
         </v-icon>
      </td>
      <td>
         <div v-for="(item, index) in model.attachments" :key="index">
            <a href="#" @click.prevent="showPhoto(item)">
               <v-img :src="item.previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1"
               />
            </a>
            {{ item.title }}
         </div>
      </td>
      <td>
         {{ model.title }}
      </td>
      <td>
         <core-highlight v-if="model.text" :queries="model.highlights" :content="model.text" />
      </td>
      <td>
         <core-label v-for="(item, index) in model.highlights" :key="index">
           {{ item }}
         </core-label>
      </td>
      <td>
         <ul>
            <li v-for="(item, index) in model.sources"  :key="index">
               <source-tag 
               :text="item.text" :link="item.link"
               />
            </li>
         </ul>
        
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
import { photoNameUrl, replaceBR } from '@/utils';
export default {
   name: 'NoteRow',
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
   data () {
		return {
         medias: {
            index: -1,
            loading: false
         }
		}
   },
   methods: {
      showPhoto(photo){
         this.$emit('show-photo', photo);
      },
      save() {
         this.$validator.validate().then(valid => {
				if(valid) {
               if(!this.model.text && !this.model.attachments.length) {
                  this.errors.add({
                     field: 'text',
                     msg: '請輸入內容'
                  });
               }else {
                  this.$emit('save');
               }
            }
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
         this.$emit('selected', this.index, this.model);
         this.model.text = replaceBR(this.model.text);
         this.model.medias = [];

         console.log('model', this.model);
      },
      getPhotoPath(attachment) {
         let width = 100;
         if(attachment.previewPath) return photoNameUrl(attachment.previewPath, width);
         else {
            let media = this.model.medias.find(item => item.file.name === attachment.name);
            return media.thumb.data;
         }
      },
      launchUpload(index) {
         this.medias.index = index;
         this.$refs.uploadButton.launch();
      },
      hideUpload() {
         this.medias.loading = false;
         this.medias.index = -1;
      },
      removeMedia(name) {
         let index = this.model.medias.findIndex(item => item.file.name === name);
         if(index > -1) this.model.medias.splice(index, 1);
      },
      removeAttachment(index) {
         let attachment = this.model.attachments[index];
         this.removeMedia(attachment.name);

         this.model.attachments.splice(index, 1);
      },
      fileExist(filename) {
         let fileNames = this.model.medias.map(item => item.file.name);
         return fileNames.includes(filename);
      },
      onFileAdded({ files, thumbs }) {
         
         for(let i = 0; i < files.length; i++) {
            let file = files[i]; 
            if(this.fileExist(file.name)) {
               Bus.$emit('warning', '圖片重複');
            }else {
               this.model.attachments.push({
                  name: file.name,
                  title: ''
               });

               let thumb = thumbs[i];
               this.model.medias.push({
                  file, thumb
               });
            }   
         }
         
         this.hideUpload();
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

