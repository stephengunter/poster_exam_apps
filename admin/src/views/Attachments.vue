<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center align-center>
			<v-flex xs12>
				<attachment-selector :select_mode="false" :allow_cancel="false"
				@selected="onSelected"
				/>
			</v-flex>
      </v-layout>
		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<v-card v-if="editor.model">
				<v-card-title>
					<span class="headline">Id : {{ editor.model.id }}</span>
					<v-spacer />
					<a href="#" @click.prevent="setEditModel(null)">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-card-title>
				<v-card-text>
					<v-img class="img-center" :src="editor.model.id | photoIdUrl"
					 :max-width="editor.model.width"
					/>
					<v-layout row>
        				<v-flex xs12>
							<v-text-field single-line hide-details :value="editor.model.previewPath" readonly>
								<template v-slot:append>
									<v-btn flat icon color="primary"
									v-clipboard="editor.model.previewPath" v-clipboard:success="onCopySuccess"
									>
										<v-icon>mdi-content-copy</v-icon>
									</v-btn>
								</template>
							</v-text-field>
						</v-flex>
					</v-layout>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</v-container>
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