<template>
   <v-row>
      <v-col cols="12" sm="4">
         <v-radio-group v-model="params.active" @change="onActiveChanged" row>
            <v-radio v-for="(item, index) in active_options" :key="index"
            :label="item.text" :value="item.value"            
            />
         </v-radio-group>
      </v-col>
      <v-col cols="12" sm="4">
         <v-select label="年度"
         :items="year_options" v-model="params.year"
         @change="onYearChanged"
         />
      </v-col>
      <v-col cols="12" sm="4" class="text-right">
         <v-tooltip  top>
				<template v-slot:activator="{ on, attrs }">
					<v-btn  small fab dark color="info" class="mt-3"
					:disabled="!can_create" @click.prevent="create"  v-bind="attrs" v-on="on"
					>
						<v-icon dark>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>新增</span>
			</v-tooltip>
      </v-col>
   </v-row>
</template>

<script>
export default {
   name: 'RecruitsHeader',
   props: {
		params: {
			type: Object,
			default: null
      },
      active_options: {
			type: Array,
			default: null
      },
      year_options: {
			type: Array,
			default: null
      },
		can_create: {
			type: Boolean,
			default: false
		}
   },
   methods: {
      create() {
         this.$emit('create');
      },
      onActiveChanged() {
			this.$emit('params-changed');
      },
      onYearChanged() {
			this.$emit('params-changed');
		},
   }
}
</script>