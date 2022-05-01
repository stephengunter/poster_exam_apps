<template>
   <v-card-actions>
      <v-tooltip top v-for="item in cancelActions" :key="item.name">
         <template v-slot:activator="{ on }">
            <v-btn :color="item.color" v-on="on" @click="fire(item.name)" class="mr-2">
              {{ item.title }}
            </v-btn>
         </template>
         <span>{{ item.description }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-tooltip top v-for="item in submitActions" :key="item.name">
         <template v-slot:activator="{ on }">
            <v-btn :color="item.color" v-on="on" @click="fire(item.name)" class="mr-2">
              {{ item.title }}
            </v-btn>
         </template>
         <span>{{ item.description }}</span>
      </v-tooltip>
   </v-card-actions>
</template>

<script>
import { 
   CANCEL, SUBMIT, SELECT, ACTION_SELECTED,
   ABORT_EXAM, DELETE_EXAM, SAVE_EXAM, STORE_EXAM
} from '@/store/actions.type';
export default {
   name: 'ExamActions',
   props: {
      actions: {
         type: Array,
         default: null
      }
   },
   computed: {
      cancelActions() {
         if(this.actions) {
            let items = this.actions.filter(item => item.type === CANCEL);
            if(items)  items.sort((a, b) => a.order - b.order);

            return items;
         }
         return [];
      },
      submitActions() {
         if(this.actions) {
            let items = this.actions.filter(item => item.type === SUBMIT);
            if(items)  items.sort((a, b) => a.order - b.order);

            return items;
         }
         return [];
      }
   },
   methods: {
      fire(name) {
         this.$emit('selected');
         Bus.$emit(ACTION_SELECTED, name);
      }
   }
}
</script>

<style>

</style>