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
               {{ props.item.id }}
            </td>
            <td>
               <v-chip v-if="props.item.isRoot" :color="props.item.free ? 'success' : 'warning'" text-color="white">
                  {{ props.item.free ? '免費' : '訂閱會員'  }}
               </v-chip>
            </td>
            <td>
               {{ props.item.title }}
            </td>
            <td>
               <ul style="list-style:none;padding:0;margin:0;">
                  <li>
                     <v-btn small @click.prevent="addFeature(props.item)" flat icon color="warning">
                        <v-icon small>mdi-plus</v-icon>
                     </v-btn>
                  </li>
                  <li v-for="(feature, index) in props.item.features" :key="index">
                     <v-icon class="mr-1" :color="feature.active ? 'success' : ''" >
                     {{ feature.active ? 'mdi-check-circle' : 'mdi-minus-circle' }}
                     </v-icon>
                     <a href="#" @click.prevent="editFeature(props.item, feature)">{{ feature.title }}</a>
                  </li>
               </ul>
            </td>
            <td>
               <ul style="list-style:none;padding:0;margin:0;">
                  <li>
                     <v-btn v-if="props.item.parentId < 1" small @click.prevent="addSubItem(props.item)" flat icon color="warning">
                        <v-icon small>mdi-plus</v-icon>
                     </v-btn>
                  </li>
                  <li v-for="(subItem, index) in props.item.subItems" :key="index">
                     <v-icon class="mr-1" :color="subItem.active ? 'success' : ''" >
                     {{ subItem.active ? 'mdi-check-circle' : 'mdi-minus-circle' }}
                     </v-icon>
                     <a href="#" @click.prevent="selectSubItem(subItem)">{{ subItem.title }}</a>
                     <v-btn class="mb-2" @click.prevent="editSubItem(subItem.id)" flat icon color="success">
                        <v-icon small>mdi-pencil</v-icon>
                     </v-btn>
                  </li>
               </ul>
            </td>
            <td :class="{ 'is-active': props.item.active }">
               {{ props.item.statusText }}
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
					text: 'Id',
               value: '',
               width: '30px'
            },
            {
					sortable: false,
               text: '',
               width: '100px'
            },
				{
					sortable: false,
               text: '標題',
               value: '',
            },
            {
					sortable: false,
					text: '功能',
               value: '',
               width: '20%'
            },
            {
					sortable: false,
					text: 'SubItems',
               value: '',
               width: '20%'
            },
				{
					sortable: false,
					text: '狀態',
					width: '90px'
            }
         ],

         sortable: null,
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
      },
      selectSubItem(item) {
         this.$emit('select', item);
      },
      editSubItem(id) {
         this.$emit('edit', id);
      },
      addSubItem(item) {
         this.$emit('add-subItem', item);
      },
      editFeature(manual, feature) {
         this.$emit('edit-feature', { manual, feature });
      },
      addFeature(manual) {
         this.$emit('add-feature', manual);
      }
   }


}

</script>



<style scoped>
.is-active {
   color:#1867c0;
}
</style>