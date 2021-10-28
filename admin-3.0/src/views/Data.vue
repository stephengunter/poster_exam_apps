<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <v-select label="Action"
				:items="actionOptions" v-model="action"
				/>
         </v-col>
         <v-col cols="12" sm="6">
            <v-btn class="mt-3" @click.prevent="onSubmit" color="success">確定</v-btn>
         </v-col>
      </v-row>

      <v-dialog v-model="form.active" persistent :max-width="form.maxWidth">
         <data-form v-if="form.active" 
         :model="model" :title="form.title"
         @cancel="onCancel" @submit="submit"
         />
		</v-dialog>
      
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { STORE_YEAR_RECRUITS, STORE_SUBJECT_QUESTIONS,
STORE_NOTE_CATEGORIES, STORE_TERM_NOTES } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'DBView',
   data () {
      return {
         actionOptions: [{
            value: STORE_YEAR_RECRUITS, text: 'STORE_YEAR_RECRUITS'
         }],
         action: '',
         model: {
            key: '',
            cmd: '',
            data: ''
         },
         form: {
            title: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			}
      };
   },
   beforeMount() {
      this.action = this.actionOptions[0].value;
   },
   computed: {
		selectedAction() {
			if(this.action) {
				return this.actionOptions.find(item => item.value === this.action);
			}
         return null;
      }
   },
   methods: {
      init() {
         this.model = {
            key: '',
            cmd: '',
            data: ''
         };
         this.form.active = false;
      },
      onCancel() {
         this.init();
      },
      onSubmit() {
         this.form.title = this.selectedAction.text;
         this.model.cmd = this.selectedAction.value;
         this.form.active = true;
      },
      submit() {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(this.action, this.model)
         .then(() => {
            Bus.$emit('success');
            this.init();
         })
         .catch(error => {
            if(error)  this.$store.commit(SET_ERROR, error);
				else onError(error);
         })
      }
   }
}
</script>

<style>

</style>