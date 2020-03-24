<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td v-if="can_remove">
            <v-btn @click.prevent="remove(props.item.id)" small  flat icon color="error">
               <v-icon>mdi-delete-circle</v-icon>
            </v-btn>
         </td>
         <td v-if="can_edit">
            <v-btn @click.prevent="edit(props.item.id)" flat icon color="success">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
         </td>
         <td>
            {{ props.item.id }}
         </td>
         <td>
            {{ props.item.title }}
         </td>
         <td>
            <option-list :options="props.item.options" 
            @show-photo="showPhoto"
            />
         </td>
         <td v-if="show_resolves" >
            <a href="#" @click.prevent="editResolves(props.item.id)" >
            {{ props.item.resolves | resolvesText }}
            </a>
         </td>
         <td v-if="show_terms" >
            <ul style="list-style-type:none;">
               <li v-for="(term, index) in props.item.terms" :key="index">
                  <a href="#" @click.prevent="showTerm(term)">
                     {{ termText(term) }}
                  </a>
               </li>
            </ul>
         </td>
         <td v-if="show_recruits">
            <ul style="list-style-type:none;">
               <li v-for="(item, index) in props.item.recruits" :key="index">
                  <a href="#" v-text="recruitText(item)"></a>
               </li>
            </ul>
         </td>
      </template>
   </v-data-table>
</template>

<script>

export default {
   name: 'QuestionsTable',
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
      if(this.can_remove) this.headers.unshift({
         sortable: false,
         text: '',
         value: '',
         width: '45px'
      });
      if(this.can_edit) this.headers.unshift({
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
         this.$emit('show-term', term);
      },
      showPhoto(photo){
         this.$emit('show-photo', photo);
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
td {
   vertical-align: text-top;
}
</style>