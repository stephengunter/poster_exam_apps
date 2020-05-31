<template>
<div>
	<v-row>
		<v-col>
			<v-radio-group v-model="params.status" row>
				<v-radio v-for="(item, index) in status_options" :key="index"
				:label="item.text" :value="item.value" 
				/>
			</v-radio-group>
		</v-col>
		<v-col class="text-right">
			<v-btn @click.prevent="onSubmit" class="mx-2" fab small>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-col>
	</v-row>
	<core-date-filter ref="dateFilter" :start="params.start" :end="params.end"
	@submit="onDateSubmit"
	/>
</div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'MessageHeader',
   props: {
		params: {
			type: Object,
			default: null
		},
		status_options: {
			type: Array,
			default: null
		}
	},
   data () {
		return {

			references: {}
		}
   },
   computed: {
		...mapGetters(['contentMaxWidth']),
		dateFilter() {
			if(this.$refs.dateFilter) return this.$refs.dateFilter;
			else if (this.references.dateFilter) return this.references.dateFilter;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		onSubmit() {
			this.dateFilter.onSubmit();        
		},
		onDateSubmit({ start, end }) {
			this.params.start = start;
			this.params.end = end;

			this.$validator.validate().then(valid => {
				if(valid) {
					this.$emit('submit');
				};
         }); 
		}
   }
}
</script>

<style>

</style>