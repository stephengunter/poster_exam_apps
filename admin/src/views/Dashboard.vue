<template>
   <v-container>
         <core-html-editor ref="htmlEditor" :content="content"
         @changed="onContentChanged"
         />

         <v-layout row>
            <v-flex xs12>
               <v-btn @click.prevent="submit" color="success">確定</v-btn>
            </v-flex>
         </v-layout>
   </v-container>
  
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex';
import { MANUAL } from '@/consts'; 
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   data () {
      return {

         references: {},
         content: `<p>
         “黑人弗洛伊德之死”再一次撕开了美国种族歧视的疮疤。对于美国民众来说，这又是一次或根治种族问题的机会，于是他们奋力呼喊、极力反抗，由此引发的抗议潮自上月26日以来已持续12天时间并蔓延至全美。
         <UPLOADPHOTO>20200203/2193fa14-4ea9-419b-a1ba-c371525d8a11.jpg&width=420<\/UPLOADPHOTO>
         
         </p>
         
         <p>
         从白宫到金门大桥，从费城到纽约。当地时间6月6日，各地的抗议活动迎来了新高潮：首都华盛顿爆发最大规模抗议活动，市长本人也走到抗议者中间；全美抗议人数创下新高，纽约、旧金山、洛杉矶、费城等地也有成千上万人走上街头。
          <UPLOADPHOTO>20200109/57339dd5-1a70-4558-90fb-f0d19f4455ed.png&width=420<\/UPLOADPHOTO>
          
          </p>

         `
      }
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      htmlEditor() {
			if(this.$refs.htmlEditor) return this.$refs.htmlEditor;
			else if (this.references.htmlEditor) return this.references.htmlEditor;
			return null;
      }
   },
	beforeMount() {
   //   const imgTags = this.content.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
   //   console.log(imgTags);
   },
   mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
      onContentChanged() {
         console.log('onContentChanged');
      },
      submit() {
         let text = this.htmlEditor.getContent();
         console.log(text);
      }
	}
}
</script>