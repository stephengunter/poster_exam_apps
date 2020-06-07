<template>
   <v-card>
      <core-close-icon-button v-if="allow_cancel" @close="cancel" />
      <v-container grid-list-sm fluid>
         <v-layout v-if="responsive" row wrap>
            <v-flex v-for="(item, index) in list" :key="index" xs4 d-flex>
               <v-card flat tile class="d-flex">
                  <attachment-item :item="item"
                  />
               </v-card>
            </v-flex>
         </v-layout>
         <v-layout v-else row wrap>
            <v-flex v-for="(item, index) in list" :key="index" xs3 d-flex>
               <v-card flat tile class="d-flex">
                  <attachment-item :item="item"
                  />
               </v-card>
            </v-flex>
         </v-layout>
      </v-container>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_ATTACHMENTS } from '@/store/actions.type';
import { onError, resolveErrorData } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'AttachmentSelector',
   props: {
		allow_cancel: {
         type: Boolean,
         default: true
      }
   },
   data () {
      return {
         params: {
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
      this.fetchData();
   },
   methods: {
      fetchData() {
			this.$store.dispatch(FETCH_ATTACHMENTS, this.params)
			.catch(error => {
				onError(error);
			})
      },
      select() {
         console.log('select');
      },
      cancel() {
         this.$emit('cancel');
      }
         
   }
}
</script>

<style>

</style>