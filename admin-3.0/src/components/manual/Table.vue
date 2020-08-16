<template>
   <v-data-table ref="tableManuals" :items="list" :headers="headers"
   hide-default-footer :server-items-length="list ? list.length : 0"
   >
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td>
                  <v-btn @click.prevent="edit(item.id)" icon color="success">
                     <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
               </td>
               <td>
                  {{ item.id }}
               </td>
               <td>
                  <v-chip v-if="item.isRoot" :color="item.free ? 'success' : 'warning'" text-color="white">
                     {{ item.free ? '免費' : '訂閱會員'  }}
                  </v-chip>
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td>
                  <ul style="list-style:none;padding:0;margin:0;">
                     <li>
                        <v-btn small @click.prevent="addFeature(item)" icon color="warning">
                           <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                     </li>
                     <li v-for="(feature, index) in item.features" :key="index">
                        <v-icon class="mr-1" :color="feature.active ? 'success' : ''" >
                        {{ feature.active ? 'mdi-check-circle' : 'mdi-minus-circle' }}
                        </v-icon>
                        <a class="a-btn" href="#"  @click.prevent="editFeature(feature.id)">{{ feature.title }}</a>
                     </li>
                  </ul>
               </td>
               <td>
                  <ul style="list-style:none;padding:0;margin:0;">
                     <li>
                        <v-btn v-if="item.parentId < 1" small @click.prevent="addSubItem(item)" icon color="warning">
                           <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                     </li>
                     <li v-for="(subItem, index) in item.subItems" :key="index">
                        <v-icon class="mr-1" :color="subItem.active ? 'success' : ''" >
                        {{ subItem.active ? 'mdi-check-circle' : 'mdi-minus-circle' }}
                        </v-icon>
                        <a class="a-btn" href="#"  @click.prevent="selectSubItem(subItem)">{{ subItem.title }}</a>
                        <v-btn class="mb-2" @click.prevent="editSubItem(subItem.id)" icon color="success">
                           <v-icon small>mdi-pencil</v-icon>
                        </v-btn>
                     </li>
                  </ul>
               </td>
               <td :class="{ 'is-active': item.active }">
                  {{ item.statusText }}
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>

<script>
export default {
   name: 'ManualTable',
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

         references: {}
		}
   },
   computed: {
		tableManuals() {
			if(this.$refs.tableManuals) return this.$refs.tableManuals;
			else if (this.references.tableManuals) return this.references.tableManuals;
			return null;
		}
	},
   mounted() {
      this.references = { ...this.$refs };
   },
   methods: {
      edit(id) {
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
      editFeature(id) {
         this.$emit('edit-feature', id);
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