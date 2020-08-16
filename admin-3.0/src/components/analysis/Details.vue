<template>
   <v-card>
      <v-card-title v-if="show_title">
         <h3>{{ model.recruit.parentTitle }}</h3>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
      </v-card-title>
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="6">
                  <exam-settings-part :model="model.parts[0]" :subject_type="subjectType" />
               </v-col>
               <v-col cols="6" v-if="model.parts.length > 1">
                  <exam-settings-part :model="model.parts[1]" :subject_type="subjectType" />
               </v-col>
            </v-row>
            <v-row v-if="!read_only">
               <v-col cols="6" class="text-left">
                  
               </v-col>
               <v-col cols="6" class="text-right">
                  <v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
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