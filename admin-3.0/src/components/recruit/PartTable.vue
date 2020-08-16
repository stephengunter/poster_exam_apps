<template>
   <v-data-table :headers="headers" :items="models" hide-default-footer item-key="index" :server-items-length="models ? models.length : 0">
      <template v-slot:item.multiAnswers="{ item }">
         <v-icon v-if="item.multiAnswers" color="success">mdi-check-circle</v-icon>
      </template>
      
      <template v-slot:item.action="{ item }">
         <v-btn @click.prevent="edit(item.id)" small icon color="success">
            <v-icon small>mdi-pencil</v-icon>
         </v-btn>
         <v-btn @click.prevent="remove(item.id)" small icon color="error">
            <v-icon>mdi-delete-circle</v-icon>
         </v-btn>
      </template>
   </v-data-table>
</template>

<script>
export default {
   name: 'RecruitPartTable',
   props: {
      models: {
         type: Array,
         default: null
      }
	},
   data () {
		return {
			headers: [
				{
					sortable: false,
					text: '標題',
               value: 'title',
               width: '25%'
            },
            {
					sortable: false,
					text: '分數',
               value: 'points',
               width: '10%'
            },
            {
					sortable: false,
					text: '選項數',
               value: 'optionCount',
               width: '10%'
            },
            {
					sortable: false,
					text: '複選題',
               value: 'multiAnswers',
               width: '10%'
            },
            {
					sortable: false,
					text: '備註',
               value: 'ps'
            },
            {
               width: '90px',
					sortable: false,
					text: '',
					value: 'action'
				}
         ]
		}
   },
   methods: {
      edit(id) {
         this.$emit('edit', id);
      },
      remove(id) {
         this.$emit('remove', id);
      },
   }
}
</script>