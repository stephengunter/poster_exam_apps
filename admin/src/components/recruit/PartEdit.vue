<template>
   <v-layout row wrap>
      <v-flex xs12>
         <span class="title">子項目</span>
         <v-btn @click.prevent="add" small  fab icon color="info">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </v-flex>
      <v-flex xs12>
         <v-data-table :items="models" :headers="headers"  hide-actions item-key="index">
            <template slot="headerCell" slot-scope="{ header }">
               <span class="subheading font-weight-light text-success text--darken-3">
                  {{ header.text }}
               </span>
            </template>
            <template slot="items" slot-scope="props">
               <td>
                  <v-text-field v-model="props.item.title"
                  v-validate="'required'"
                  :data-vv-name="`subitem_title_${props.index}`"
                  :error-messages="getErrMsg(['title',`subitem_title_${props.index}`])"
                  />
               </td>
               <td>
                  <v-text-field v-model="props.item.points"
                  v-validate="'numeric'"
                  :data-vv-name="`subitem_points_${props.index}`"
                  :error-messages="getErrMsg(['points',`subitem_points_${props.index}`])"
                  />
               </td>
               <td>
                  <v-select label="選項數"
                     :items="countOptions" v-model="props.item.optionCount"
                  />
               </td>
               <td>
                  <v-checkbox v-model="props.item.multiAnswers" label="複選" 
						/>
               </td>
               <td>
                  <v-text-field v-model="props.item.ps"
                  />
               </td>
               <td>
                  <v-btn @click.prevent="remove(props.index)" small  flat icon color="error" slot="activator">
                     <v-icon>mdi-delete-circle</v-icon>
                  </v-btn>
               </td>
            </template>
         </v-data-table>
      </v-flex>
   </v-layout>
   
</template>


<script>
import difference from 'lodash/difference';
export default {
	name: 'RecruitSubItemEdit',
	props: {
		parent_id: {
         type: Number,
         default: 0
      },
      init_models: {
         type: Array,
         default: null
      }
	},
	data () {
		return {
         models: [],
			headers: [
				{
					sortable: false,
					text: '標題',
               value: '',
               width: '25%'
            },
            {
					sortable: false,
					text: '分數',
               value: '',
               width: '10%'
            },
            {
					sortable: false,
					text: '選項數',
               value: '',
               width: '10%'
            },
            {
					sortable: false,
					text: '複選題',
               value: '',
               width: '10%'
            },
            {
					sortable: false,
					text: '備註',
               value: ''
            },
            {
               width: '50px',
					sortable: false,
					text: '',
					value: ''
				}
         ],

         canAdd: false,
         countOptions: []

		}
	},
	beforeMount(){
      if(this.init_models) this.models = this.init_models.slice(0);
      for(let i = 1; i <= 5; i++) {
         this.countOptions.push({
            value: i, text: i
         })
      }
	},
	methods: {
      getErrMsg(keys){
         let err = this.errors.collect(keys[1]);
			if(err && err.length){
            let msg = err[0];
            if(keys[0] === 'title') return msg.replace(keys[1], '標題');
            if(keys[0] === 'points') return msg.replace(keys[1], '分數');
				return msg;
			}
			return '';
      },
      add(){
         this.models.push({
            id: 0,
            parentId: this.parent_id,
            title: '',
            points: 0,
            optionCount: 4,
            multiAnswers: false          
         });
      },
		remove(index){
         this.models.splice(index, 1);
      },
      submit(){
         this.$validator.validate().then(valid => {
            if(valid) this.$emit('submit', this.models);
         });
      }
	}
}
</script>
