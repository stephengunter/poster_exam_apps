<template>
<div>
   <tiptap-vuetify v-model="text" :extensions="extensions">
      <div slot="footer" style="background: #f5f5f5;" >
         <v-tooltip  top content-class="top">
            <v-btn @click.prevent="editCode" flat icon slot="activator">
               <v-icon>mdi-code-tags</v-icon>
            </v-btn>
            <span>原始碼</span>
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
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, CodeBlock, Paragraph, BulletList, OrderedList,
  ListItem, Link, Blockquote, HardBreak, HorizontalRule, History
} from 'tiptap-vuetify';

import { DIALOG_MAX_WIDTH } from '@/config';

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
   components: { TiptapVuetify },
   data () {
		return {
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
         }
		}
   },
   computed: {
		...mapGetters(['contentMaxWidth'])
   },
   beforeMount() {
      this.text = this.content;
   },
   watch: {
      text: 'onChanged'
   },
   methods: {
      onChanged() {
         this.$emit('update', this.text);
         this.$emit('changed', this.text);
      },
      editCode() {
			this.code.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.code.active = true;
		}      
   }
}
</script>

<style>

</style>