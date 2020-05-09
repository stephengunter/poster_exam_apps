<template>
   <tiptap-vuetify v-model="htmlContent" :extensions="extensions">
   </tiptap-vuetify>
</template>

<script>
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, CodeBlock, Paragraph, BulletList, OrderedList,
  ListItem, Link, Blockquote, HardBreak, HorizontalRule, History
} from 'tiptap-vuetify';

export default {
   name: 'HtmlEditor',
   props: {
		content: {
         type: String,
         default: ''
      },
      version: {
         type: Number,
         default: 0
      }
   },
   components: { TiptapVuetify },
   data () {
		return {
         htmlContent: '',

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
		}
   },
   beforeMount() {
      this.htmlContent = this.content;
   },
   watch: {
      version: 'onSubmit',
      htmlContent: 'onContentChanged'
   },
   methods: {
      onContentChanged() {
         this.$emit('content-changed', this.htmlContent);
      },
      onSubmit() {
         this.$emit('submit', this.htmlContent);
      }
   }
}
</script>

<style>

</style>