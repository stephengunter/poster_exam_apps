<template>
	<v-row v-if="responsive">
		<v-col cols="8">
			<v-radio-group v-model="params.open" @change="onParamsChanged" row>
				<v-radio v-for="(item, index) in open_options" :key="index"
				:label="item.text" :value="item.value"					
				/>
			</v-radio-group>
		</v-col>
		<v-col cols="4" class="text-right">
			<core-button-create class_name="mt-2" tooltip="新增" :disabled="!can_create"
			@create="create"
			/>
		</v-col>
		<v-col cols="12">
			<v-radio-group v-model="params.active" @change="onParamsChanged" row>
				<v-radio v-for="(item, index) in active_options" :key="index"
				:label="item.text" :value="item.value"
				/>
			</v-radio-group>
		</v-col>
	</v-row>
	<v-row v-else>
		<v-col cols="4">
			<v-radio-group v-model="params.open" @change="onParamsChanged" row>
				<v-radio v-for="(item, index) in open_options" :key="index"
				:label="item.text" :value="item.value"					
				/>
			</v-radio-group>
		</v-col>
		<v-col cols="4">
			<v-radio-group v-model="params.active" @change="onParamsChanged" row>
				<v-radio v-for="(item, index) in active_options" :key="index"
				:label="item.text" :value="item.value"
				/>
			</v-radio-group>
		</v-col>
		<v-col cols="4" class="text-right">
			<core-button-create class_name="mt-2" tooltip="新增" :disabled="!can_create"
			@create="create"
			/>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'NoticeHeader',
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