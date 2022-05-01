<template>
<div>
   <v-dialog v-model="photo.active" :max-width="photo.maxWidth">
      <v-card v-if="photo.model">
         <core-close-icon-button @close="showPhoto(null)" />
         <v-card-text>
            <div class="text-center" style="padding-top:36px;">
               <v-img class="img-center" :src="photo.model.id | photoIdUrl"
                  :max-width="photo.model.width"
               />
               <span v-if="photo.model.title" style="font-size: 16px; display: inline-block;" class="mt-3" v-text="photo.model.title"></span>
            </div>
         </v-card-text>
      </v-card>
   </v-dialog>
   <v-dialog v-model="term.active" :max-width="term.maxWidth">
      <term-show :model="term.model" :max_width="term.maxWidth"
		@cancel="term.active = false"
		/>
   </v-dialog>
   <v-dialog v-model="note.active" :max-width="note.maxWidth">
      <note-show :model="note.model"
      @cancel="note.active = false"
      />
   </v-dialog>
</div>      
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SHOW_PHOTO, SHOW_TERM, SHOW_NOTE, TERM_DETAILS, NOTE_DETAILS } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'LayoutShow',
   data() {
      return {
         photo: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
         },
         
         term: {
				model: null,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			note: {
				model: null,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
      };
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth'])
	},
   created() {
      Bus.$on(SHOW_PHOTO, this.showPhoto);
      Bus.$on(SHOW_TERM, (term) => {
         this.setTerm(term);
      });
	},
	mounted() {
		window.addEventListener(SHOW_TERM, this.onShowTerm);
		window.addEventListener(SHOW_NOTE, this.onShowNote);
	},
	beforeDestroy() {
		window.removeEventListener(SHOW_TERM, this.onShowTerm);
		window.removeEventListener(SHOW_NOTE, this.onShowNote);
   },
   methods: {
      showPhoto(photo) {
         if(photo) {
            this.photo.model = photo;
				this.photo.active = true;
			}else {
				this.photo.model = null;
				this.photo.active = false;
			}
      },
      onShowTerm(e) {
			if(e) {
				let id = e.detail.id;
				this.$store.dispatch(TERM_DETAILS, id)
				.then(model => {
					this.setTerm(model);
				})
				.catch(error => {
					onError(error);
				})
			}else {
				this.term.model = null
				this.term.active = true;
			}
      },
      setTerm(model) {
         if(model) {
            this.term.model = model;
            this.term.active = true;
         }else {
            this.term.model = null;
            this.term.active = false;
         }
      },
      onShowNote(e) {
			if(e) {
				let id = e.detail.id;
				this.$store.dispatch(NOTE_DETAILS, id)
				.then(model => {
					this.setNote(model);
				})
				.catch(error => {
					onError(error);
				})
			}else {
				this.note.model = null
				this.note.active = true;
			}
      },
      setNote(model) {
         if(model) {
            this.note.model = model;
            this.note.active = true;
         }else {
            this.note.model = null;
            this.note.active = false;
         }
      },
   }
}
</script>