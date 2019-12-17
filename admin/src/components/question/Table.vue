<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td style="vertical-align: text-top;">
            <v-tooltip top  content-class="top">
               <a href="#" @click.prevent="select(props.item.id)"  slot="activator" icon>
               {{ props.item.title }}
               </a>
               <span>編輯</span>
            </v-tooltip>
         </td>
         <td style="vertical-align: text-top;">
            <ul>
               <li v-for="(option,index) in props.item.options" :key="option.id" :class="{ 'option-display': index > 0, 'correct-option': option.correct }" >
                  {{ option.title }}
               </li>
            </ul>
         </td>
         <td>
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
		}
   },
   data () {
		return {
			headers: [
				{
					sortable: false,
					text: '標題',
               value: '',
               width: '50%'
				},
				{
					sortable: false,
					text: '選項',
					value: ''
            },
            {
					sortable: false,
					text: '考古題',
               width: '15%'
				},
			]	
		}
	},
   methods: {
      select(id){
         this.$emit('selected', id);
      }
   }


}

</script>

<style scoped>
.option-display {
   padding-top: 1em;
}
.correct-option {
   color:#1867c0
}
</style>