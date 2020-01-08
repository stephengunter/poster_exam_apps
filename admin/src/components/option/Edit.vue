<template>
   <v-layout row wrap>
      <v-flex xs12>
         <span class="title">選項</span>
         <v-btn @click.prevent="add" small  fab icon color="info">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </v-flex>
      <v-flex xs12>
         <v-data-table :items="models" :headers="headers"  hide-actions item-key="index">
            <template slot="headerCell" slot-scope="{ header }">
               <span class="subheading font-weight-light text-success text--darken-3">
                  {{ header.text }}
               </span>
            </template>
            <template slot="items" slot-scope="props">
               <td>
                  <v-img v-if="props.item.medias[0]" :src="props.item.medias[0].thumb.data" max-width="100" aspect-ratio="1">
                     <v-btn color="success" style="margin:0;position:absolute;top:0;right:0;width:30px;height:30px;" flat icon
                     @click="removeMedia(props.index)">
                        <v-icon>mdi-close-circle-outline</v-icon>
                     </v-btn>
                  </v-img>
                  <v-btn v-else v-show="medias.index === -1 || medias.index === props.index"
                  @click="launchUpload(props.index)" :loading="medias.loading" :disabled="medias.loading"
                  >
                     附圖<v-icon right dark>mdi-image</v-icon>
                  </v-btn>
               </td>
               <td>
                  <!-- <v-text-field v-model="props.item.title"
                  v-validate="'required'"
                  :data-vv-name="`option_title_${props.index}`"
                  :error-messages="getErrMsg(['title',`option_title_${props.index}`])"
                  /> -->

                  <v-text-field v-model="props.item.title"
                  :error-messages="getErrMsg(['title',`option_title_${props.index}`])"
                  />
               </td>
               <td>
                  <v-checkbox label="正確" v-model="props.item.correct" @change="onCorrectChanged(props.index)"
                  />
               </td>
               <td>
                  <v-btn @click.prevent="remove(props.index)" small  flat icon color="error" slot="activator">
                     <v-icon>mdi-delete-circle</v-icon>
                  </v-btn>
               </td>
            </template>
         </v-data-table>
         <core-upload-button v-show="false" ref="uploadButton" :multiple="false"
         @file-added="onFileAdded" @loading="medias.loading = true"
         />
      </v-flex>
   </v-layout>
   
</template>


<script>

export default {
	name: 'OptionEdit',
	props: {
		question_id: {
         type: Number,
         default: 0
      },
      multi_answers: {
         type: Boolean,
         default: false
      },
      init_models: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
         models: [],
			headers: [
            {
               width: '120px',
					sortable: false,
					text: '',
					value: ''
            },
				{
					sortable: false,
					text: '',
					value: ''
            },
            {
					sortable: false,
					text: '',
					value: ''
            },
            {
               width: '50px',
					sortable: false,
					text: '',
					value: ''
				}
         ],
         
         medias: {
            index: -1,
            loading: false,
            fileNames: []
         }
		}
   },
   provide() {
      return {
         $validator: this.$validator,
      }
   },
	beforeMount(){
		if(this.init_models) this.models = this.init_models.slice(0);
	},
	methods: {
      getCorrectItems() {
         return this.models.filter(item => item.correct);
      },
      getErrMsg(keys){
         let err = this.errors.collect(keys[1]);
			if(err && err.length){
            let msg = err[0];
            if(keys[0] === 'title') return msg.replace(keys[1], '標題');
				return msg;
			}
			return '';
      },
      add(){
         let correctItems = this.getCorrectItems();

         this.models.push({
            id: 0,
            questionId: this.question_id,
            title: '',
            medias: [],
            correct: correctItems.length > 0 ? false : true
         });
      },
		remove(index){
         this.models.splice(index, 1);
      },
      launchUpload(index) {
         this.medias.index = index;
         this.$refs.uploadButton.launch();
      },
      fileExist(filename) {
         let idx = this.medias.fileNames.findIndex(name => name === filename);
         console.log('idx', idx);
         return idx > -1;
      },
      onFileAdded({ files, thumbs }) {
         let idx = this.medias.index;
         let file = files[0];
         if(this.fileExist(file.name)) {
            Bus.$emit('warning', '圖片重複');
         }
         else {
            this.medias.fileNames.push(file.name);
            
            let thumb = thumbs[0];
            this.models[idx].medias = [{ file, thumb }];
         }
         
         this.medias.index = -1;
         this.medias.loading = false;
         console.log('models', this.models);
      },
      removeMedia(index){
         this.models[index].medias = [];
         console.log('models', this.models);
      },
      onCorrectChanged(index) {
         if(this.multi_answers) {

         }else {
            let item = this.models[index];
            let correctItems = this.getCorrectItems();
            if(correctItems.length > 1) {
               for(let i = 0; i < this.models.length; i++) {
                  if(i !== index) this.models[i].correct = false;
               }
            }
         }
      },
      submit(){
         this.$validator.validate().then(valid => {
            if(valid) {
               let checkTitles = true;
               for(let i = 0; i < this.models.length; i++) {
                  if(this.models[i].medias.length) continue;
                  if(!this.models[i].title) {
                     checkTitles = false;
                     this.errors.add({
                        field: `option_title_${i}`,
                        msg: '請輸入標題'
                     });
                  }
               }

               if(checkTitles) this.$emit('submit', this.models);
            }
         });
      }
	}
}
</script>
