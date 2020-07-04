<template>
	<v-container>
		<v-treeview :open="tree.open"
		:items="tree.items" item-children="subItems"
		activatable return-object
		:active.sync="tree.active"
		>
			<template v-slot:label="{ item, open, active }">
				<v-btn text>
					<span style="font-size: 16px;" :class="{ 'primary--text' : active }">
						{{ item.title }}
						{{ open }}
						{{ active}}
					</span>
				</v-btn>
			</template>
		</v-treeview>
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmptyObject } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {
			tree: {
				items: [{
					id: 1, title: 'Node 1', subItems: [{
						id : 101, title: 'sub A', subItems: []
					}]
				},{
					id: 2, title: 'Node 2', subItems: [{
						id : 201, title: 'sub B', subItems: []
					}]
				}],

				open: [2],
				active: [201]
			}
		}
	},
	watch: {
      tree:{
         handler(){
            this.test();
         },
         deep: true
		}
	},
	beforeMount() {
		this.tree.open = this.tree.items[0];
		
	},
	methods: {
		test() {
			console.log(this.tree);
		}
	},
	

}
</script>


