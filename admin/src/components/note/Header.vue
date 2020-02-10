<template>
<div>
	<v-layout row wrap>
		<v-flex xs12 sm6>
			<core-bread :items="bread.items"
			@selected="onBreadSelected"
			/>
		</v-flex>
		<v-flex xs12 sm6 text-xs-right>
			<v-btn @click.prevent="refresh" class="mx-2" fab small>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-flex>
	</v-layout>
	<v-dialog v-model="category.active" persistent :max-width="category.maxWidth">
		<note-category @ready="init"
		@params-changed="onParamsChanged"
		@cancel="category.active = false"
		/>
	</v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { NOTE_CATEGORY } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'NoteHeader',
   props: {
		can_create: {
			type: Boolean,
			default: false
		},
	},
   data () {
		return {
			params: null,
			subjects : [],
			terms: [],
			category: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			bread: {
            items: []
			},
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			categories: state => state.notes.categories
		}),
		rootSubject() {
			if(this.params.rootSubject) return this.categories.find(item => item.id === this.params.rootSubject);
			return null;
		},
		subject() {
			if(this.params.subject) {
				return this.subjects.find(item => item.id === this.params.subject);
			}else if(this.term){
				return this.subjects.find(item => item.id === this.term.parentId);
			}
			return null;
		},
		term() {
			if(this.params.term) {
				return this.terms.find(item => item.id === this.params.term);
			}
			return null;
		}
	},
	beforeMount() {

	},
   methods: {
		init() {
			this.showCategory();

			let subjects = this.categories.flatMap(item => item.subItems);
			let terms = subjects.flatMap(item => item.subItems);
			this.subjects = subjects;
			this.terms = terms;
		},
		onParamsChanged(params) {
			this.$emit('params-changed', params);
			this.params = params;
			this.setTitle();
			this.category.active = false;
		},
		setTitle() {
			this.clearBread();
			this.addBreadItem(NOTE_CATEGORY, this.rootSubject.text);

			if(this.params.keyword) {
				if(this.subject) this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				this.addBreadItem(NOTE_CATEGORY, `搜尋：${this.params.keyword}` );
			}else {
				
				this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				if(this.term) this.addBreadItem(NOTE_CATEGORY, this.term.text);
			}
			
      },
		clearBread() {
         this.bread.items = [];
      },
      addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
      },
		onBreadSelected(item) {
			this.showCategory();
		},
		showCategory() {
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
		},
		refresh() {
			this.$emit('refresh');
		}
   }
}
</script>

<style>

</style>