<template>
   <core-container>
      <v-row>
         <v-col cols="12">
            <v-btn icon 
            v-clipboard:copy="foo"
      v-clipboard:success="onCopy"
            >
               <v-icon color="sucess">mdi-content-copy</v-icon>
            </v-btn>

            <v-text-field single-line hide-details :value="foo" readonly
            >
               <template v-slot:append>
                  <v-btn icon 
            v-clipboard:copy="foo"
      v-clipboard:success="onCopy"
            >
               <v-icon color="sucess">mdi-content-copy</v-icon>
            </v-btn>
               </template>
            </v-text-field>
			</v-col>
      </v-row>
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_QUESTIONS } from '@/store/actions.type';
import { SET_TERMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, findSubject } from '@/utils';

export default {
   name: 'DashboardView',
   data () {
      return {
         foo: 'damnsscscscsss',
         headers: [
            {
					sortable: false,
					text: '',
               value: 'action',
               width: '30px'
            },
            {
               class: ['text-success'],
					sortable: false,
					text: '年度',
               value: 'year',
               width: '90px'
				},
				{
					sortable: false,
					text: '名稱',
               value: 'title',
               width: '15%'
            },
            {
					sortable: false,
					text: '筆試科目',
               value: 'subItems',
               width: '35%'
            },
            {
					sortable: false,
               text: '日期',
               value: 'dateText',
               width: '90px'
				},
				{
					sortable: false,
               text: '狀態',
               value: 'status',
					width: '90px'
            },
            {
					sortable: false,
               text: '',
               value: 'doneText',
					width: '90px'
            }
         ],

         list:[]
      }
   },
   computed: {
     
	},
   beforeMount() {

   },
   mounted() {
		
	},
   methods: {
      onCopy: function (e) {
      alert('You just copied: ' + e.text)
    },
   }
}
</script>

<style>

</style>