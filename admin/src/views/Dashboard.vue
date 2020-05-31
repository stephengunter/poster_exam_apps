<template>
   <v-container grid-list-md>
      <core-html-editor v-model="model.content"/>
      <div style="height:100px"></div>
      <!-- <tiptap-vuetify ref="editor" v-model="model.content" :extensions="extensions">
         <div slot="footer" style="background: #f5f5f5;" >
            <v-tooltip  top content-class="top">
               <v-btn @click.prevent="switchMode" flat icon slot="activator">
                  <v-icon>{{ code ? 'mdi-view-quilt' : 'mdi-code-tags' }}</v-icon>
               </v-btn>
               <span>{{ code ? '視圖' : '原始碼' }}</span>
            </v-tooltip>
         </div>
      </tiptap-vuetify> -->

      <v-btn type="submit" @click.prevent="onSubmit" color="primary">存檔</v-btn>
   </v-container>
  
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, CodeBlock, Paragraph, BulletList, OrderedList,
  ListItem, Link, Blockquote, HardBreak, HorizontalRule, History
} from 'tiptap-vuetify';
export default {
   components: {
      TiptapVuetify
   },
   data () {
      return {
         code: false,
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
         customToolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "code-block"]
         ],
         model: {
            title: '',
            content: `<h1>Some initial content</h1>`
         }
      }
   },
   computed: {
		...mapGetters(['currentUser'])
	},
   beforeMount() {
     
		
   },
   mounted() {
      console.log(this.$refs.editor);
   },
   methods: {
      handleImageAdded(file, Editor, cursorLocation, resetUploader) {

      },
      switchMode() {
         this.code = !this.code;
		},
      onSubmit() {
         console.log(this.model);
      }
   }
}
</script>