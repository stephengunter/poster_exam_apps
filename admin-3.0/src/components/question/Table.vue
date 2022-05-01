<template>
   <v-data-table :items="list" :headers="headers"
   :server-items-length="list ? list.length : 0"  hide-default-footer item-key="id"
   >
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="item in items" :key="item.id">
               <td>
                  <v-btn v-if="can_edit" @click.prevent="edit(item.id)" icon color="success">
                     <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn v-if="can_remove" @click.prevent="remove(item.id)" small icon color="error">
                     <v-icon>mdi-delete-circle</v-icon>
                  </v-btn>
               </td>
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
                  <a href="#" v-if="item.attachments.length" @click.prevent="showPhoto(item.attachments[0])">
                     <img  style="vertical-align:middle" 
                     :src="item.attachments[0].previewPath | photoNameUrl(50)"
                     >
                  </a>
               </td>
               <td style="padding: 10px 16px;">
                  <option-list :options="item.options" 
                  @show-photo="showPhoto"
                  />
               </td>
               <td v-if="show_resolves" >
                  <a class="a-btn" href="#" @click.prevent="editResolves(item.id)" >
                  {{ item.resolves | resolvesText }}
                  </a>
               </td>
               <td v-if="show_terms" >
                  <ul style="list-style-type:none; padding-left: 0px;">
                     <li v-for="(term, index) in item.terms" :key="index">
                        <a class="a-btn" href="#" @click.prevent="showTerm(term)">
                           {{ termText(term) }}
                        </a>
                     </li>
                  </ul>
               </td>
               <td v-if="show_recruits">
                  <ul style="list-style-type:none; padding-left: 0px;">
                     <li v-for="(item, index) in item.recruits" :key="index" v-text="recruitText(item)">
                     </li>
                  </ul>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>

<script>
import { SHOW_PHOTO, SHOW_TERM } from '@/store/actions.type';

export default {
   name: 'QuestionTable',
   props: {
		list: {
         type: Array,
         default: null
      },
      can_remove: {
         type: Boolean,
         default: false
      },
      can_edit: {
         type: Boolean,
         default: true
      },
      show_resolves: {
         type: Boolean,
         default: true
      },
      show_recruits: {
         type: Boolean,
         default: true
      },
      show_terms: {
         type: Boolean,
         default: false
      }
   },
   data () {
		return {
			headers: [
            {
					sortable: false,
					text: 'Id',
               value: '',
               width: '30px'
				},
				{
					sortable: false,
					text: '標題',
               value: '',
               width: '40%'
				},
				{
					sortable: false,
					text: '選項',
					value: ''
            }
			]	
		}
   },
   beforeMount() {
      if(this.can_remove || this.can_edit) this.headers.unshift({
         sortable: false,
         text: '',
         value: '',
         width: '45px'
      });
      if(this.show_resolves) this.headers.push({
         sortable: false,
         text: '解析',
         width: '10%'
      });
      if(this.show_terms) this.headers.push({
         sortable: false,
         text: '條文',
         width: '15%'
      });
      if(this.show_recruits) this.headers.push({
         sortable: false,
         text: '考古題',
         width: '15%'
      });
   },
   methods: {
      termText(term) {
         if(term.subject) return `${term.subject.title} ${term.title}`;
         return term.title;
      },
      showTerm(term) {
         Bus.$emit(SHOW_TERM, term);
      },
      showPhoto(photo){
         Bus.$emit(SHOW_PHOTO, photo);
      },
      recruitText(item) {
         return item.parents[0].title;
      },
      remove(id) {
         this.$emit('remove', id);
      },
      edit(id){
         this.$emit('edit', id);
      },
      editResolves(id) {
         this.$emit('edit-resolves', id);
      }
   }


}

</script>

<style scoped>
</style>