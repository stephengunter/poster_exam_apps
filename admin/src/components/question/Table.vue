<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td>
            <v-btn @click.prevent="edit(props.item.id)" flat icon color="success">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
         </td>
         <td>
             {{ props.item.title }}
         </td>
         <td>
            <ul class="options">
               <li v-for="(option,index) in props.item.options" :key="option.id" :class="{ 'option-display': index > 0, 'correct-option': option.correct }" >
                  <v-icon v-if="option.correct" color="success">
                     mdi-check-circle
                  </v-icon>
                  {{ option.title }}
               </li>
            </ul>
         </td>
         <td v-if="show_terms" >
            <ul style="list-style-type:none;">
               <li v-for="(term, index) in props.item.terms" :key="index">
                  <a href="#" @click.prevent="showTerm(term)" v-text="termText(term)"></a>
               </li>
            </ul>
         </td>
         <td v-if="show_recruits">
            {{ props.item.recruitsText }}
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
					text: '',
               value: '',
               width: '45px'
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
      if(this.show_terms) this.headers.push({
         sortable: false,
         text: '條文',
         width: '20%'
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
      edit(id){
         this.$emit('edit', id);
      }
   }


}

</script>

<style scoped>
td {
   vertical-align: text-top;
}
.options {
   padding-left : 0px;
   list-style-type : none;
}
.option-display {
   padding-top: 0.2em;
}
.correct-option {
   color:#1867c0;
   font-size : 1.6em; 
}
</style>