<template>
   <v-row>
      <v-col cols="12">
         <span class="titleText">選項</span>
         <core-button-create
         class_name="ml-3 mb-2" tooltip="新增"
         @create="add"
         />
      </v-col>
      <v-col cols="12">
         <validation-observer ref="validator">
            <v-data-table :items="models" :headers="headers"  hide-default-footer>
               <template v-slot:body="{ items }">
                  <tbody>
                     <tr v-for="(item, index) in items" :key="index">
                        <td v-if="item.attachments.length && item.attachments[0].id" style="padding: 10px 16px;">
                           <v-img :src="item.attachments[0].previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1">
                              <core-close-icon-button color="success"
                              @close="removeAttachments(index)"
                              />
                           </v-img>
                        </td>
                        <td v-else style="padding: 10px 16px;">
                           <v-img v-if="item.medias[0]" :src="item.medias[0].thumb.data" max-width="100" aspect-ratio="1">
                              <core-close-icon-button color="success"
                              @close="removeMedia(index)"
                              />
                           </v-img>
                           <core-upload-button color="default" v-else :multiple="false"
                           @launch="launchUpload(index)" @file-added="onFileAdded"
                           >
                              附圖<v-icon right dark>mdi-image</v-icon>
                           </core-upload-button>
                        </td>
                        <td>
                           <validation-provider v-slot="{ errors }" :name="`option_title_${index}`">
                              <v-text-field  v-model="item.title"
                              :error-messages="getErrMsg(errors, `option_title_${index}`)"
                              />
                           </validation-provider>
                        </td>
                        <td>
                           <v-checkbox label="正確" v-model="item.correct" @change="onCorrectChanged(index)"
                           />
                        </td>
                        <td>
                           <v-btn @click.prevent="remove(index)" small icon color="error">
                              <v-icon>mdi-delete-circle</v-icon>
                           </v-btn>
                        </td>   
                     </tr>
                  </tbody>
               </template>
            </v-data-table>
         </validation-observer>
      </v-col>
   </v-row>
   
</template>


<script>
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

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
         },

         references: {},
		}
   },
   computed: {
      validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	beforeMount() {
      if(this.init_models) {
         this.models = this.init_models.map(item => {
            return {
               ...item, medias: []
            }
         });
      } 
   },
   mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
      getCorrectItems() {
         return this.models.filter(item => item.correct);
      },
      getErrMsg(errors, key) {
         if(errors && errors[0]) {
            return errors[0].replace(key, '標題');
         } return '';
      },
      add() {
         let correctItems = this.getCorrectItems();

         this.models.push({
            id: 0,
            questionId: this.question_id,
            title: '',
            medias: [],
            attachments: [],
            correct: correctItems.length > 0 ? false : true
         });
      },
		remove(index) {
         this.models.splice(index, 1);
      },
      launchUpload(index) {
         this.medias.index = index;
      },
      fileExist(filename) {
         let idx = this.medias.fileNames.findIndex(name => name === filename);
         return idx > -1;
      },
      onFileAdded({ files, thumbs }) {
         let idx = this.medias.index;
         this.clearContentError([idx]);
         
         let file = files[0];
         if(this.fileExist(file.name)) {
            Bus.$emit('warning', '圖片重複');
         }else {
         
            this.medias.fileNames.push(file.name);
            
            let thumb = thumbs[0];
            this.models[idx].medias = [{ file, thumb }];
         }
         
         this.medias.index = -1;
      },
      removeMedia(index) {
         this.models[index].medias = [];
      },
      removeAttachments(index) {
         this.models[index].attachments = [];
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
      checkContent() {
         let keys = [];
         for(let i = 0; i < this.models.length; i++) {
            let model = this.models[i];
            if(model.medias.length || model.attachments.length) continue;

            if(!model.title)  keys.push(`option_title_${i}`);
         }

         if(keys.length) {
            let errors = { ...this.validator.errors };
            keys.forEach(key => {
               errors[key] = '必須填寫內容';
            });
            this.validator.setErrors(errors);
            return false;
         } else return true;
      },
		clearContentError(indexes = []) {
         let keys = [];
         for(let i = 0; i < indexes.length; i++) {
            keys.push(`option_title_${indexes[i]}`);
         }
			let errors = clearErrors(this.validator.errors, keys);
			this.validator.setErrors(errors);
		},
      submit() {
         let indexes = this.models.map((item, index) => index);
         this.clearContentError(indexes);

         this.validator.validate().then(valid => {
            if(!valid) return;
            if(!this.checkContent()) return;

            this.$emit('submit', this.models);
         });
      }
	}
}
</script>
