<template>
   <core-container>
      <v-row>
			<v-col cols="12">
				<attachment-selector ref="selector" :select_mode="false" :allow_cancel="false"
				@selected="onSelected"
				/>
			</v-col>
      </v-row>
		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<attachment-edit v-if="editor.active" :model="editor.model"
			@saved="onSaved" @cancel="cancelEdit"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'AttachmentsView',
   data () {
		return {
			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			}
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
		selector() {
			if(this.$refs.selector) return this.$refs.selector;
			else if (this.references.selector) return this.references.selector;
			return null;
		}
   },
	mounted() {
		this.references = { ...this.$refs };
   },
   methods: {
		onSelected(item) {
			this.setEditModel(item);
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.active = false;
				this.editor.model = null;
			}
		},
		onRemove() {
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
			console.log('remove', this.editor.model.id);
		},
		cancelEdit() {
			this.setEditModel(null);
		},
		onSaved() {
			this.selector.fetchData();
			this.setEditModel(null);
		}
		
		
	}
}
</script>

<style>

</style>