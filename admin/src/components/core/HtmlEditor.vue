<template>
<div>
   <v-card>
      <editor-menu-bar :editor="editor" v-slot="{ commands }">
         <v-layout row style="background: #f5f5f5;">
            <v-flex sm12>
               <v-tooltip  top content-class="top">
                  <v-btn @click.prevent="editCode" flat icon slot="activator">
                     <v-icon>mdi-code-tags</v-icon>
                  </v-btn>
                  <span>原始碼</span>
               </v-tooltip>
               <v-btn @click="addImage(commands.image)" flat icon>
                  <v-icon>mdi-image</v-icon>
               </v-btn>
            </v-flex>
         </v-layout>
      </editor-menu-bar>
      <v-layout row>
         <v-flex sm12 style="background: #fafafa; min-height:240px">
            <article>
            <editor-content style="margin: 1em;" :editor="editor" />
            </article> 
         </v-flex>
      </v-layout>

      
   </v-card>
   <v-dialog v-model="code.active" persistent :max-width="code.maxWidth">
      <v-card>
         <core-close-icon-button @close="cancelEditCode" />
         <v-container grid-list-md>
            <v-layout row>
               <v-flex xs12 style="background: #fafafa;">
                  <v-textarea ref="codeInput" v-model="code.text" flat full-width filled solo 
                  background-color="#fafafa" auto-grow
                  rows="15" row-height="15"
                  />
               </v-flex>
            </v-layout>
            <v-layout row>
               <v-flex xs12>
                  <v-btn @click.prevent="submitCode" color="success">確定</v-btn>
               </v-flex>
            </v-layout>
         </v-container>
      </v-card>
   </v-dialog>
   <v-dialog v-model="photo.active" persistent :max-width="photo.maxWidth">
      <attachment-selector 
      @selected="onImageSelected" @cancel="cancelSelectImage" 
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { HardBreak, Heading, Image, Bold, Link } from 'tiptap-extensions';

import { photoNameUrl } from '@/utils';
import { DIALOG_MAX_WIDTH, API_URL, PHOTO_ACTION_PATH } from '@/config';
import { SHOW_PHOTO } from '@/store/actions.type';

export default {
   name: 'HtmlEditor',
   components: {
      EditorContent, EditorMenuBar
   },
   props: {
		content: {
         type: String,
         default: ''
      }
   },
   data () {
		return {
         editor: null,

         code: {
            text: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },
         photo: {
				active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            command: null
         }
		}
   },
   computed: {
		...mapGetters(['contentMaxWidth'])
   },
   mounted() {
      this.initEditor();
	},
	beforeDestroy(){
      if(this.editor) this.editor.destroy();
   },
   methods: {
      initEditor() {
         this.editor = new Editor({
            extensions: [
               new HardBreak(),
               new Heading({ levels: [1, 2, 3] }),
               new Image(),
               new Bold(),
               new Link()
            ],
            content: this.convertDraft(this.content),
            onUpdate: this.onContentChanged
         });
      },
      onContentChanged() {
         this.$emit('changed');
      },
      convertDraft(text) {
         let result = text;
         let matches = text.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);
         if(!matches) return result;
         
         for(let i = 0; i < matches.length; i++) {
            let name = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
            let photoUrl = photoNameUrl(name, DIALOG_MAX_WIDTH);
            
            //result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
            result = result.replace(matches[i], `<img src="${photoUrl}">`);
         }
         return result;
      },
      convertText(draft) {
         let result = draft;
         let matches = draft.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
         if(!matches) return result;
        
         for(let i = 0; i < matches.length; i++) {
            let parts = /<img[^>]+src="(.*?)"/.exec(matches[i]);
            let src = parts[1].trim();
            let url = new URL(src);
            if(url.origin === API_URL && url.pathname.toLowerCase() === PHOTO_ACTION_PATH) {
               let params = url.searchParams;
               if(params.has('name')) {
                  let name = params.get('name');
                  // let isEmoji = name.split('/')[0] === 'emoji';
                  // let newTag = isEmoji ? `<UPLOADEMOJI>${name}<\/UPLOADEMOJI>` : `<UPLOADPHOTO>${name}<\/UPLOADPHOTO>`;
                  result = result.replace(matches[i], `<UPLOADPHOTO>${name}<\/UPLOADPHOTO>`);
               }
            }
         }
         return result;
      },
      editCode() {
         this.code = {
            text: this.editor.getHTML(),
				active: true,
				maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH
         };
      },
      cancelEditCode() {
         this.code = {
            text: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         };
      },
      submitCode() {
         this.editor.setContent(this.convertDraft(this.code.text));
         this.cancelEditCode();
      },
      addImage(command) {
         this.photo.command = command;
         this.photo.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
         this.photo.active = true;
      },
      onImageSelected(item) {
         this.photo.command({ src: photoNameUrl(item.previewPath, DIALOG_MAX_WIDTH) });
         this.$nextTick(() => {
            this.cancelSelectImage();
         })
      },
      cancelSelectImage() {
         this.photo.command = null;
         this.photo.maxWidth = DIALOG_MAX_WIDTH;
         this.photo.active = false;
      },
      getContent() {
         let draft =  this.editor.getHTML();
         return this.convertText(draft);
      }
   }
}
</script>

<style>

</style>