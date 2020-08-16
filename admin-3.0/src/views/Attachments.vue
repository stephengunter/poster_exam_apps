<template>
   <core-container>
      <v-row>
			<v-col cols="12">
				<attachment-selector :select_mode="false" :allow_cancel="false"
				@selected="onSelected"
				/>
			</v-col>
      </v-row>
		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<v-card v-if="editor.active">
				<v-card-title>
					<span class="headline">Id : {{ editor.model.id }}</span>
					<v-spacer />
					<v-btn @click.prevent="setEditModel(null)" icon>
						<v-icon>mdi-window-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-img class="img-center" :src="editor.model.id | photoIdUrl"
								:max-width="editor.model.width"
								/>
							</v-col>
							<v-col cols="12">
								<v-text-field single-line hide-details :value="editor.model.previewPath" readonly>
									<template v-slot:append>
										<v-btn icon v-clipboard:copy="editor.model.previewPath" v-clipboard:success="onCopySuccess">
											<v-icon>mdi-content-copy</v-icon>
										</v-btn>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
      	</v-card>
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
			foo: 'damnsscscscsss',
			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			},
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth'])
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
		onCopySuccess() {
			Bus.$emit('success', 'Copy Success');
		}
	}
}
</script>

<style>

</style>