<template>
   <v-card>
      <v-card-title v-if="allow_cancel">
         <h3 v-if="title">{{ title }}</h3>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
            <v-icon>mdi-window-close</v-icon>
         </v-btn>
      </v-card-title>
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="6">
                  <v-select label="Type"
                  :items="typeOptions" v-model="params.type"
                  @change="onTypeChanged"
                  />
               </v-col>
               <v-col cols="6" class="text-right">
                  <core-upload-button :multiple="false" class_name="mt-2"
                  @file-added="onFileAdded"
                  />
               </v-col>
            </v-row>

            <attachment-list :list="list"
            @selected="select"
            />
            
            <v-col cols="12">
               <core-table-pager v-if="pagedList"  v-show="list.length > 0"
               :model="pagedList" :responsive="responsive" 
               @pageChanged="onPageChanged" :can_size="false"
               />
            </v-col>
         </v-container>
      </v-card-text> 
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_ATTACHMENTS, STORE_ATTACHMENT } from '@/store/actions.type';
import { onError, resolveErrorData } from '@/utils';
import { POST_TYPES } from '@/consts';

export default {
   name: 'AttachmentSelector',
   props: {
      title: {
         type: String,
         default: ''
      },
      post_type: {
         type: String,
         default: ''
      },
      select_mode: {
         type: Boolean,
         default: true
      },
		allow_cancel: {
         type: Boolean,
         default: true
      }
   },
   data () {
      return {
         params: {
            type: '',
            page: 1,
            pageSize: 12
         }
      }
   },
   computed: {
      ...mapGetters(['responsive', 'contentMaxWidth']),
      ...mapState({
			pagedList: state => state.attachments.pagedList,
      }),
      list() {
         if(this.pagedList) {
            return this.pagedList.viewList;
         }
         return [];
      }
   },
   beforeMount() {
      let options = [];
		Object.keys(POST_TYPES).forEach(key => {
			options.push({
				value: POST_TYPES[key],
				text: POST_TYPES[key]
			})
		});
		
		this.typeOptions = options;
      if(this.post_type) {
         let type = options.find(item => item.value === this.post_type);
         if(exsit) this.params.type = this.post_type;
      }
      
      this.fetchData();
   },
   methods: {
      fetchData() {
			this.$store.dispatch(FETCH_ATTACHMENTS, this.params)
			.catch(error => {
				onError(error);
			})
      },
      onTypeChanged() {
			this.fetchData();
      },
      onPageChanged(page) {
			this.params.page = page;
			this.fetchData();
		},
      onFileAdded({ files, thumbs }) {
         let file = files[0];
         let media = {
            postType: this.params.type,
            postId: 0,
            files: [file]
         };
         this.$store.dispatch(STORE_ATTACHMENT, media)
			.then(attachments => {
            if(this.select_mode) this.$emit('select', attachments[0]);
            else this.fetchData();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
      },
      select(item) {
         this.$emit('selected', item);
      },
      cancel() {
         this.$emit('cancel');
      }
         
   }
}
</script>

<style>

</style>