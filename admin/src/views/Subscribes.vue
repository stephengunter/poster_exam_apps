<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					
					<v-layout row wrap>
						<v-flex xs12>
							
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import {
   FETCH_RECRUITS
} from '@/store/actions.type';

export default {
   name: 'SubscribesView',
   data () {
		return {
			params: {
				active: 1
			},
			activeOptions: [{
				value: 1,
				text: '上架中'
			},{
				value: 0,
				text: '已下架'
			}],
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		}
   },
   beforeMount(){
		this.init();
   },
   methods: {
		init(){
			
		},
		onParamsChanged() {
			this.fetchData(this.params);
		},
		fetchData(params){
			
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_RECRUIT)
			.then(model => {
				model.year = this.editor.yearOptions[0].value;
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_RECRUIT, id)
			.then(model => {
				console.log('model', model);
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model.recruit;
				if(model.subjectOptions) this.editor.subjectOptions = model.subjectOptions;
				

				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		remove(){
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
	}
}
</script>

<style>

</style>