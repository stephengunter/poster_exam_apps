<template>
	<v-treeview  ref="subjectTree"
   :items="items" item-children="subItems"
   open-all activatable
   :active.sync="active"
   >
      <template v-slot:label="{ item, active }">
         <v-btn text>
            <span style="font-size: 16px;" :class="{ 'primary--text' : active }">
               {{ item.title }}
            </span>
            <v-icon v-if="show_status" class="ml-1" :color="item.active ? 'success' : ''">mdi-check-circle
               {{  item.active ? 'mdi-check-circle' : 'mdi-minus-circle-outline' }}
            </v-icon>
         </v-btn>
      </template>
   </v-treeview>
</template>

<script>
export default {
   name: 'SubjectTree',
   props: {
		items: {
         type: Array,
         default: null
      },
      show_status: {
         type: Boolean,
         default: false
      },
      version: {
         type: Number,
         default: 0
      },
      selected_id: {
         type: Number,
         default: 0
      }
	},
	data () {
		return {
         active: [],
         references: {}
		}
	},
	computed: {
      subjectTree() {
			if(this.$refs.subjectTree) return this.$refs.subjectTree;
			else if (this.references.subjectTree) return this.references.subjectTree;
			return null;
		},
		selectedId() {
			if(this.active.length) return this.active[0];
			return 0;
      }
	},
	watch: {
      version: 'init',
      selectedId: 'onSelectedIdChanged',
      'selected_id' : 'setSelectedId'
   },
   mounted() {
      this.references = { ...this.$refs };
      this.init();
	},
	methods: {
		init() {
         this.setSelectedId(this.selected_id);
         this.subjectTree.updateAll(true);
      },
      setSelectedId(val) {
         if(val === this.selectedId) return;
         if(!val) this.active = [];
         else this.active = [val];
      },
		onSelectedIdChanged() {
         this.$emit('selected', this.selectedId);
      }
	}
}
</script>