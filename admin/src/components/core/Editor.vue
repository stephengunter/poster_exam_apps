<template>
   <v-card>
      <v-layout row style="background: #f5f5f5;">
         <v-flex sm12>
            <v-tooltip  top content-class="top">
               <v-btn @click.prevent="switchMode" flat icon slot="activator">
                  <v-icon>{{ code ? 'mdi-view-quilt' : 'mdi-code-tags' }}</v-icon>
               </v-btn>
               <span>{{ code ? '視圖' : '原始碼' }}</span>
            </v-tooltip>
            <v-tooltip  top content-class="top">
               <v-btn @click.prevent="pickPhoto" flat icon slot="activator">
                  <v-icon>mdi-image</v-icon>
               </v-btn>
               <span>圖片</span>
            </v-tooltip>
         </v-flex>
      </v-layout>
      <v-layout row>
         <v-flex sm12 style="background: #fafafa;">
            <v-textarea ref="codeInput" v-model="text" v-show="code" flat full-width filled solo 
            background-color="#fafafa" auto-grow
            rows="15" row-height="15" @change="onContentChanged"
            @input="handleChange"
            />
            <p v-show="!code" v-html="content" style="min-height:240px">
            </p>
         </v-flex>
      </v-layout>
   </v-card>
</template>

<script>
export default {
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
   data () {
		return {
         text: '',
         lastText: '',
			code: true
		}
   },
   beforeMount() {
      this.text = this.content;
   },
   methods: {
		switchMode() {
         this.code = !this.code;
		},
		onContentChanged() {
         this.$emit('update', this.text);
      },
      pickPhoto() {
         console.log('pickPhoto');   
      },
      handleChange() {
         let textarea = this.$refs.codeInput;
         console.log(textarea)

      //    let cursorPosition = textarea.selection;
      //   this.$nextTick(() => console.log(cursorPosition));
         return;
         // handle backspace event
      //   if (this.value.length < this.lastText.length) {
      //       this.lastText = this.value;
      //       this.$emit('input-changed', this.value);
      //       return;
      //   }
        // handle value-edit event
        if (this.$refs.input.selectionStart < this.value.length) {
            const startPos = this.$refs.input.selectionStart;
            this.value = this.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
            this.$nextTick(() => this.setCursorPosition(this.$refs.input, startPos));
            this.lastText = this.value;
            this.$emit('input-changed', this.value);
            return;
        }
        // handle everything else
      //   this.value = this.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
      //   this.lastText = this.value;
      //   this.$emit('input-changed', this.value);
      }
   }
}
</script>

<style>

</style>