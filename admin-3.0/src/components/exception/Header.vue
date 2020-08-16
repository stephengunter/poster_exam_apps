<template>
<div>
	<v-row>
		<v-col cols="12" sm="6">
			<v-select label="Type"
			:items="type_options" v-model="filter.type"
			@change="onFilterTypeChanged"
			/>
		</v-col>
		<v-col cols="12" sm="6">
			<v-text-field v-model="dateSelector.text" label="日期" clearable
			@click.prevent="selectDate" @click:clear="clearDate"
         />
		</v-col>
	</v-row>
</div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'ExceptionHeader',
   props: {
		params: {
			type: Object,
			default: null
		},
		type_options: {
			type: Array,
			default: null
		}
	},
   data () {
		return {
			filter: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				type: ''
			},

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
		showFilter() {
			this.filter.active = true;
		},
		clearFilter() {
			this.params.type = '';
			this.filter.type = '';
		},
		onFilterTypeChanged(val) {
			this.params.type = val;
			this.filter.active = false;
      },
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