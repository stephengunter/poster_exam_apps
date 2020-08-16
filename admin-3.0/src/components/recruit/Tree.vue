<template>
	<v-treeview  ref="recruitTree"
   :items="items" item-children="subItems"
   open-all activatable hoverable
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
import { mapGetters } from 'vuex';
export default {
   name: 'RecruitTree',
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
      ...mapGetters(['contentMaxWidth']),
      recruitTree() {
			if(this.$refs.recruitTree) return this.$refs.recruitTree;
			else if (this.references.recruitTree) return this.references.recruitTree;
			return null;
		},
		selectedId() {
			if(this.active.length) return this.active[0];
			return 0;
      },
      treeMaxWidth() {
			return this.contentMaxWidth - 65;
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
         this.recruitTree.updateAll(true);
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