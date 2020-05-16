<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="index">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td>
            <v-tooltip v-if="props.item.active" top content-class="top">
               <v-btn @click.prevent="off(props.item.id)" flat icon slot="activator">
                  <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
               </v-btn>
               <span>下架</span>
            </v-tooltip>
            <v-btn v-else @click.prevent="edit(props.item.id)" flat icon color="success">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
         </td>
         <td>
            <v-chip v-if="props.item.top" color="warning" text-color="white">置頂</v-chip>
         </td>
         <td>
            <v-chip v-if="props.item.active" color="success" text-color="white">{{ props.item.statusText }}</v-chip>
            <v-chip v-else>{{ props.item.statusText }}</v-chip>
         </td>
         <td>
            {{ props.item.lastUpdatedText }}
         </td>
         <td>
             {{ props.item.title }}
         </td>
         <td v-html="props.item.content">
           
         </td>
      </template>
      
   </v-data-table>
</template>


<script>
export default {
	name: 'NoticeTable',
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
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: '',
               value: '',
                width: '60px'
            },
            {
					sortable: false,
					text: '',
               value: '',
                width: '90px'
            },
            {
					sortable: false,
					text: '日期',
               value: '',
               width: '120px'
            },
            {
					sortable: false,
					text: '主旨',
               value: '',
               width: '20%'
            },
            {
					sortable: false,
					text: '內容',
               value: '',
            }
         ]
		}
   },
	methods: {
      edit(id){
         this.$emit('edit', id);
      },
      off(id) {
         this.$emit('off', id)
      }
	}
}
</script>
