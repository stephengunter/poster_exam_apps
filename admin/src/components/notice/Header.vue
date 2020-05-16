<template>
	<v-layout v-if="responsive" row wrap>
		<v-flex xs6>
			<v-radio-group v-model="params.open" row>
				<v-radio v-for="(item, index) in open_options" :key="index"
				:label="item.text" :value="item.value"
				@change="onParamsChanged"
				/>
			</v-radio-group>
		</v-flex>
		<v-flex xs6 text-xs-right>
			<v-tooltip top content-class="top">
            <v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
               <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span>新增</span>
         </v-tooltip>
		</v-flex>
		<v-flex xs12>
			<v-radio-group v-model="params.active" row>
				<v-radio v-for="(item, index) in active_options" :key="index"
				:label="item.text" :value="item.value"
				@change="onParamsChanged"
				/>
			</v-radio-group>
		</v-flex>
	</v-layout>
	<v-layout v-else row wrap>
		<v-flex xs4>
			<v-radio-group v-model="params.open" row>
				<v-radio v-for="(item, index) in open_options" :key="index"
				:label="item.text" :value="item.value"
				@change="onParamsChanged"
				/>
			</v-radio-group>
		</v-flex>
		<v-flex xs4>
			<v-radio-group v-model="params.active" row>
				<v-radio v-for="(item, index) in active_options" :key="index"
				:label="item.text" :value="item.value"
				@change="onParamsChanged"
				/>
			</v-radio-group>
		</v-flex>
		<v-flex xs4 text-xs-right>
			<v-tooltip top content-class="top">
            <v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
               <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span>新增</span>
         </v-tooltip>
		</v-flex>
	</v-layout>
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
		open_options: {
         type: Array,
         default: null
		},
		active_options: {
         type: Array,
         default: null
		},
		can_create: {
			type: Boolean,
			default: false
		}
   },
   data () {
		return {
			
		}
	},
   computed: {
		...mapGetters(['responsive'])
	},
   methods: {
		create() {
         this.$emit('create');
		},
		onParamsChanged() {
			this.$emit('submit');
		}
   }
}
</script>

<style>

</style>