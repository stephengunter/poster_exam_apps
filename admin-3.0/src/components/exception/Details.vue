<template>
	<v-card>
		<v-card-title>
			<v-spacer />
			<v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="12" sm="6">
						<v-text-field label="日期" :value="model.dateTimeText" readonly
						/>
					</v-col>
					<v-col cols="12" sm="6">
						<v-text-field label="Type" :value="model.typeName" readonly
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<p>
						{{ model.content }}
						</p>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
	</v-card>
</template>


<script>

export default {
	name: 'ExceptionDetails',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			
		}
	},
	methods: {
		cancel(){
         this.$emit('cancel');
		}
	}
}
</script>
