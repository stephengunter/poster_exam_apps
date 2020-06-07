<template>
   <v-container>
      <div class="editor">
         <editor-menu-bar :editor="editor" v-slot="{ commands }">
            <div class="menubar">  Damn
               <button
                  class="menubar__button"
                  @click="showImagePrompt(commands.image)"
               >
                 
               </button>
            </div>
         </editor-menu-bar>

         <editor-content class="editor__content" :editor="editor" />
      </div>
      <!-- <core-html-editor :content="content" /> -->
      <!-- <UPLOADPHOTO>130</UPLOADPHOTO> -->
   </v-container>
  
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex';
import { MANUAL } from '@/consts'; 
import { DIALOG_MAX_WIDTH } from '@/config';
import { SHOW_PHOTO } from '@/store/actions.type';import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  HardBreak,
  Heading,
  Image,
  Bold,
  Code,
  Italic,
} from 'tiptap-extensions'

export default {
   components: {
      EditorContent,
      EditorMenuBar,
   },
   data () {
      return {
         editor: new Editor({
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Image(),
          new Bold(),
          new Code(),
          new Italic(),
        ],
        content: `
          <h2>
            Images
          </h2>
          <p>
            This is basic example of implementing images. Try to drop new images here. Reordering also works.
          </p>
          <img src="http://localhost:50070/photo/130?width=420" />
        `,
      }),


         result: '',
         content: `<p>
         “黑人弗洛伊德之死”再一次撕开了美国种族歧视的疮疤。对于美国民众来说，这又是一次或根治种族问题的机会，于是他们奋力呼喊、极力反抗，由此引发的抗议潮自上月26日以来已持续12天时间并蔓延至全美。
         </p>
         <p>
         <img src="http://localhost:50070/photo/130?width=480" >
         </p>
         <p>
         从白宫到金门大桥，从费城到纽约。当地时间6月6日，各地的抗议活动迎来了新高潮：首都华盛顿爆发最大规模抗议活动，市长本人也走到抗议者中间；全美抗议人数创下新高，纽约、旧金山、洛杉矶、费城等地也有成千上万人走上街头。
          </p>
         
         
         `
      }
   },
   computed: {
		...mapGetters(['contentMaxWidth'])
   },
	beforeMount() {
      // let matches = this.content.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);

      // let result = this.content;
      // for(let i = 0; i < matches.length; i++) {
      //    let id = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
      //    result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
      // }
      // this.result = result;
   },
	methods: {
      showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
    },
	}
}
</script>