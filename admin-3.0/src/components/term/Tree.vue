<template>
	<v-treeview  ref="termTree"
   :items="items" item-children="subItems"
   open-all activatable active-class="primary--text" hoverable
   :active.sync="active"
   >
      <template v-slot:label="{ item, active }">
         <term-tree-item :item="item" :max_width="treeMaxWidth" :active="active" />
         
      </template>
   </v-treeview>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
   name: 'TermTree',
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
      termTree() {
			if(this.$refs.termTree) return this.$refs.termTree;
			else if (this.references.termTree) return this.references.termTree;
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
         this.termTree.updateAll(true);
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