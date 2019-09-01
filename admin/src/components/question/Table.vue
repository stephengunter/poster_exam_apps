<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td class="term-display" style="min-width: 200px">
            <ul>
               <li style="padding-top: 1em;">
                  <v-tooltip top  content-class="top">
                     <a href="#" @click.prevent="select(props.item.id)"  slot="activator" icon>
                     {{ props.item.title }}
                     </a>
                     <span>編輯</span>
                  </v-tooltip>
                  <br>
                  <span v-html="props.item.text"></span>
               </li>
            </ul>
            
            
         </td>
         <td class="term-display">
            <ul v-if="props.item.subItems.length">
               <li v-for="subItem in props.item.subItems" :key="subItem.id" style="padding-top: 1em;">
                  <v-tooltip top  content-class="top">
                     <a href="#" @click.prevent="select(subItem.id)"  slot="activator" icon>
                        {{ subItem.title }}
                     </a>
                     <span>編輯</span>
                  </v-tooltip>
                  <br>
                  <span v-html="subItem.text"></span>
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
		}
   },
   data () {
		return {
			headers: [
				{
					sortable: false,
					text: '',
					value: ''
				},
				{
					sortable: false,
					text: '',
					value: ''
				}
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
.term-display {
   vertical-align: text-top;
   
}
</style>