<template>
   <v-card>
      <v-card-title v-if="show_title">
         <span class="headline" >
            {{ model.recruit.parentTitle }}
         </span>
         <v-spacer />
         <a href="#" @click.prevent="cancel">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-container grid-list-md>
            <v-layout>
               <v-flex xs6>
                  <exam-settings-part :model="model.parts[0]" :subject_type="subjectType" />
               </v-flex>
               <v-flex xs6 v-if="model.parts.length > 1">
                  <exam-settings-part :model="model.parts[1]" :subject_type="subjectType" />
               </v-flex>
            </v-layout>
         </v-container>
      </v-card-text>
      <v-card-actions v-if="!read_only">
         <v-spacer />
         <v-btn type="submit" @click.prevent="onSubmit" color="primary">存檔</v-btn>
      </v-card-actions>
   </v-card>
   
</template>

<script>
export default {
   props: {
      model: {
         type: Object,
         default: null
      },
      root_subject_settings: {
         type: Object,
         default: null
      },
      show_title: {
         type: Boolean,
         default: true
      },
      read_only: {
         type: Boolean,
         default: false
      }
   },
   computed: {
      subjectType() {
         if(this.model && this.root_subject_settings){
            if(this.model.subjectId === this.root_subject_settings.firstId) return 'first';
            else if(this.model.subjectId === this.root_subject_settings.secondId) return 'second';
         }
         return '';
      }
   },
   methods: {
      cancel(){
			this.$emit('cancel');
      },
      onSubmit() {
         this.$emit('save');
      }
   }
}
</script>