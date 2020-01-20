<template>
<div>
   <div class="mb-2" v-if="responsive">
      <a href="#" @click.prevent="launchFilter" class="a-btn"  >
         {{ bread.text ?  bread.text : title }}
      </a>
   </div>
   <div v-else>
      <v-row>
			<v-col cols="8">
				<a href="#" @click.prevent="launchFilter" class="a-btn"  >
					{{ bread.text ?  bread.text : title }}
				</a>
			</v-col>
			<v-col cols="4" class="text-right">
				<v-btn color="info" outlined >
					<v-icon left>mdi-plus-circle-outline</v-icon>
					新測驗
         	</v-btn>
			</v-col>
		</v-row>
   </div>

   <v-dialog v-model="filter.active" :max-width="filter.maxWidth" persistent>
      <ExamFilter  ref="examFilter"
      :params="params"
      :status_options="status_options" :subject_options="subject_options"
      @submit="submit" @cancel="filter.active = false;"
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { getListText } from '@/utils';
import ExamFilter from '@/components/exam/Filter';

export default {
   name: 'ExamHeader',
   components: {
      ExamFilter
   },
   props: {
      mode: {
			type: Object,
			default: null
      },
      params: {
			type: Object,
			default: null
		},
      title: {
			type: String,
			default: ''
      },
      status_options: {
         type: Array,
         default: null
      },
      subject_options: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
         filter: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         },

			bread: {
            items: [],
            text: ''
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated'])
   },
   methods: {
      init() {
         this.bread = {
            items: [],
            text: ''
         };
         this.filter =  {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         };

         this.bread.items = [this.title];
			this.addBreadItem(this.mode.text);
      },
      addBreadItem(text) {
         this.bread.items.push(text);
         this.bread.text = getListText(this.bread.items);
      },
      setTitle() {
         let params = this.params;

         let subjectText = '';
         if(params.subject > 0) {
            let subject = this.subject_options.find(item => item.value === params.subject);
            subjectText = subject.text;
         }

         let statusText = '';
         if(params.status > -1) {
            let status = this.status_options.find(item => item.value === params.status);
            statusText = status.text;
         }

         this.bread.items = [this.title];
         this.addBreadItem(this.mode.text);

         if(statusText) this.addBreadItem(statusText);
         if(subjectText) this.addBreadItem(subjectText);
      },
      launchFilter() {
         this.filter.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.filter.active = true;
      },
      submit() {
         this.$emit('filter-submit');

         this.setTitle();
         this.filter.active = false;
      }

   }
}
</script>