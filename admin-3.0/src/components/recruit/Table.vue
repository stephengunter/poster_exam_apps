<template>
   <v-data-table ref="tableRecruits" :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.id" class="row-recruit">
            <td>
               <v-btn @click.prevent="edit(item.id)" icon color="success">
                  <v-icon small>mdi-pencil</v-icon>
               </v-btn>
            </td>
            <td>
               {{ item.year }}
            </td>
            <td>
               {{ item.title }}
            </td>
            <td>
               <ul v-show="item.subItems">
                  <li v-for="(subItem, index) in item.subItems" :key="index">
                     <a href="#" class="a-btn" @click.prevent="editSubItem(subItem.id)">{{ subItem.title }}</a>
                  </li>
               </ul>
            </td>
            <td>
               {{ item.dateText }}
            </td>
            <td>
               <span :class="{ 'is-active': item.active }">{{ item.statusText }}</span>
            </td>
            <td>
               {{ item.doneText }}
            </td>
          </tr>
        </tbody>
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
               value: 'action',
               width: '30px'
            },
            {
					sortable: false,
					text: '年度',
               value: 'year',
               width: '90px'
				},
				{
					sortable: false,
					text: '名稱',
               value: 'title',
               width: '15%'
            },
            {
					sortable: false,
					text: '筆試科目',
               value: 'subItems',
               width: '35%'
            },
            {
					sortable: false,
               text: '日期',
               value: 'dateText',
               width: '90px'
				},
				{
					sortable: false,
               text: '狀態',
               value: 'status',
					width: '90px'
            },
            {
					sortable: false,
               text: '',
               value: 'doneText',
					width: '90px'
            }
         ],

         sortable: null,

         references: {}
		}
   },
   computed: {
		tableRecruits() {
			if(this.$refs.tableRecruits) return this.$refs.tableRecruits;
			else if (this.references.tableRecruits) return this.references.tableRecruits;
			return null;
		}
	},
   watch: {
      'allow_drag' (val) {
         this.sortable.option('sort', val);
      }
   },
   mounted() {
      this.references = { ...this.$refs };
      this.$nextTick(this.bindSortable);
   },
   methods: {
      bindSortable() {
         const el = this.tableRecruits.$el.getElementsByTagName('tbody')[0];
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
      },
      editSubItem(id) {
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