<template>
   <v-data-table ref="tableRecruits"  :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <tr class="row-recruit" :key="props.item.id">
            <td>
               <v-btn @click.prevent="edit(props.item.id)" flat icon color="success">
                  <v-icon small>mdi-pencil</v-icon>
               </v-btn>
            </td>
            <td>
               {{ props.item.year }}
            </td>
            <td>
               {{ props.item.title }}
            </td>
            <td>
               <ul v-show="props.item.subItems">
                  <li v-for="(subItem, index) in props.item.subItems" :key="index">
                     {{ subItem.title }}
                  </li>
               </ul>
            </td>
            <td>
               {{ props.item.dateText }}
            </td>
            <td :class="{ 'is-active': props.item.active }">
               {{ props.item.statusText }}
            </td>
            <td>
               {{ props.item.doneText }}
            </td>
         </tr>
      </template>
   </v-data-table>
</template>

<script>
import Sortable from 'sortablejs';
export default {
   name: 'RecruitsTable',
   props: {
		list: {
         type: Array,
         default: null
      },
      allow_drag: {
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
					text: '年度',
               value: '',
               width: '90px'
				},
				{
					sortable: false,
					text: '名稱',
               value: '',
               width: '15%'
            },
            {
					sortable: false,
					text: '筆試科目',
               value: '',
               width: '35%'
            },
            {
					sortable: false,
					text: '日期',
               width: '90px'
				},
				{
					sortable: false,
					text: '狀態',
					 width: '90px'
            },
            {
					sortable: false,
					text: '',
					 width: '90px'
            }
         ],

         sortable: null,
		}
   },
   watch: {
      'allow_drag' (val) {
         this.sortable.option('sort', val);
      }
   },
   mounted() {
      this.bindSortable();
   },
   methods: {
      bindSortable() {
         const el = this.$refs.tableRecruits.$el.getElementsByTagName('tbody')[0];
         this.sortable = Sortable.create(
            el,
            {
               draggable: '.row-recruit',
               onEnd: this.onDragEnd
            }
         );
      },
      onDragEnd ({ oldIndex, newIndex }) {
        this.$emit('order-changed', { oldIndex, newIndex });         		
      },
      edit(id){
         this.$emit('edit', id);
      }
   }


}

</script>



<style scoped>
.is-active {
   color:#1867c0;
}
</style>