<template>
   <v-card>
      <core-close-icon-button v-if="allow_cancel" @close="cancel" />
      <v-card-title >
         <v-layout wrap :class="{ 'mt-3' : allow_cancel }">
            <v-flex xs12 sm6>
               <v-select label="Type"
               :items="typeOptions" v-model="params.type"
               @change="onTypeChanged"
               />
            </v-flex>
            <v-flex xs12 sm6 text-xs-right>
               <core-upload-button :multiple="false"
               @file-added="onFileAdded"
               />
            </v-flex>
         </v-layout>
      </v-card-title>
      <v-container grid-list-sm fluid>
         <v-layout v-if="responsive" row wrap>
            <v-flex v-for="(item, index) in list" :key="index" xs4 d-flex>
               <v-card flat tile class="d-flex">
                  <attachment-item :item="item"
                  @select="onSelect"
                  />
               </v-card>
            </v-flex>
         </v-layout>
         <v-layout v-else row wrap>
            <v-flex v-for="(item, index) in list" :key="index" xs3 d-flex>
               <v-card flat tile class="d-flex">
                  <attachment-item :item="item"
                  @select="onSelect"
                  />
               </v-card>
            </v-flex>
         </v-layout>
         <v-flex sm12>
            <core-table-pager v-if="pageList"  v-show="list.length > 0"
            :model="pageList" :responsive="responsive" 
            @pageChanged="onPageChanged" :can_size="false"
            />
         </v-flex>
      </v-container>
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
			pageList: state => state.attachments.pageList,
      }),
      list() {
         if(this.pageList) {
            return this.pageList.viewList;
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
            console.log(this.select_mode);
            if(this.select_mode) this.$emit('select', attachments[0]);
            else this.fetchData();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
      },
      onSelect(item) {
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