<template>
<div>
   <tiptap-vuetify v-model="draft" :extensions="extensions">
      <div slot="footer" style="background: #f5f5f5;" >
         <v-tooltip  top content-class="top">
            <v-btn @click.prevent="editCode" flat icon slot="activator">
               <v-icon>mdi-code-tags</v-icon>
            </v-btn>
            <span>原始碼</span>
         </v-tooltip>
         <v-tooltip  top content-class="top">
            <v-btn @click.prevent="addImage" flat icon slot="activator">
               <v-icon>mdi-image</v-icon>
            </v-btn>
            <span>插入圖片</span>
         </v-tooltip>
      </div>
   </tiptap-vuetify>
   <v-dialog v-model="code.active" persistent :max-width="code.maxWidth">
      <v-card>
         <core-close-icon-button @close="code.active = false" />
         <v-container grid-list-md>
            <v-layout wrap>
               <v-flex xs12 style="background: #fafafa;">
                  <v-textarea ref="codeInput" v-model="text" flat full-width filled solo 
                  background-color="#fafafa" auto-grow
                  rows="15" row-height="15" @change="onChanged"
                  />
               </v-flex>
            </v-layout>
         </v-container>
      </v-card>
   </v-dialog>
   <v-dialog v-model="photo.active" persistent :max-width="photo.maxWidth">
      <attachment-selector 
      @cancel="photo.active = false" 
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, CodeBlock, Paragraph, BulletList, OrderedList,
  ListItem, Link, Blockquote, HardBreak, HorizontalRule, History
} from 'tiptap-vuetify';
import { photoIdUrl } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';
import { SHOW_PHOTO } from '@/store/actions.type';

export default {
   name: 'HtmlEditor',
   props: {
		content: {
         type: String,
         default: ''
      }
   },
   model: {
      prop: 'content',
      event: 'update'
   },
   components: { 
      TiptapVuetify
   },
   data () {
		return {
         version: 0,

         draft: '',
         text: '',
         extensions: [
            new Heading({
               levels: [1, 2, 3]
            }),
            new Bold(),
            new Italic(),
            new Strike(),
            new Underline(),
            new Code(),
            new CodeBlock(),
            new Paragraph(),
            new BulletList(),
            new OrderedList(),
            new ListItem(),
            new Link(),
            new Blockquote(),
            new HardBreak(),
            new HorizontalRule(),
            new History()
         ],

         code: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },
         photo: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         }
		}
   },
   computed: {
		...mapGetters(['contentMaxWidth'])
   },
   beforeMount() {
      this.text = this.content;
      this.draft = this.convert(this.content);

      console.log('beforeMount draft', this.draft);
   },
   mounted() {
		window.addEventListener(SHOW_PHOTO, this.onShowPhoto);
	},
	beforeDestroy(){
		window.removeEventListener(SHOW_PHOTO, this.onShowPhoto);
   },
   watch: {
      text: 'onChanged'
   },
   methods: {
      onChanged() {
         if(!this.version) {
            this.version += 1;
            return;
         }
         
         this.draft = this.convert(this.text);
         this.$emit('update', this.text);
         this.$emit('changed', this.text);

         console.log('draft', this.draft);
      },
      convert(text) {
         let result = text;
         let matches = text.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);
         if(!matches) return result;
         
         for(let i = 0; i < matches.length; i++) {
            let id = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
            let photoUrl = photoIdUrl(id, DIALOG_MAX_WIDTH);
            
            result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
            //result = result.replace(matches[i], `<img src="${photoUrl}">`);
         }
         
      },
      editCode() {
			this.code.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.code.active = true;
      },
      addImage() {
         this.photo.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.photo.active = true;
      },
      onImageSelected(id) {

      },
      onShowPhoto(e) {
         let id = e.detail.id;
			console.log('onShowPhoto', id);
		}
   }
}
</script>

<style>

</style>