<template>
	<v-container fluid grid-list-xl fill-height>
     <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row>
						<v-flex xs12 sm6 md6>
							
						</v-flex>
						<v-flex xs12 sm6 md6 class="text-lg-right">
							<v-tooltip top content-class="top">
								<v-btn :disabled="!canCreate" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
								<span>新增</span>
							</v-tooltip>
						</v-flex>
					</v-layout>
					
					<v-layout row wrap>
						<v-flex sm12>
							<v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
								<template slot="headerCell" slot-scope="{ header }">
									<span class="subheading font-weight-light text-success text--darken-3">
										{{ header.text }}
									</span>
								</template>
								<template slot="items" slot-scope="props">
									<td>
										<v-tooltip top  content-class="top">
											<a href="#" @click.prevent="edit(props.item.id)"  slot="activator" icon>
												{{ props.item.title }}
											</a>
											<span>編輯</span>
										</v-tooltip>
									</td>
									<td>
										<ul v-if="props.item.subItems.length">
											<li v-for="subItem in props.item.subItems" :key="subItem.id">
												<v-tooltip top  content-class="top">
													<a href="#" @click.prevent="edit(subItem.id)"  slot="activator" icon>
														{{ subItem.title }}
													</a>
													<span>編輯</span>
												</v-tooltip>
											</li>
										</ul>
									</td>
								</template>
							</v-data-table>
							
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	  <v-dialog v-model="editting" persistent max-width="500px">
			<subject-edit v-if="editting" :model="model" 
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deleting" width="480px">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_SUBJECTS, CREATE_SUBJECT, STORE_SUBJECT,
EDIT_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'SubjectsView',
	data () {
		return {
			params: {
				
			},
			headers: [
				{
					sortable: false,
					text: '',
					value: ''
				},
				{
					sortable: false,
					text: '',
					value: ''
				}
			],

			
			editting: false,
			deleting: false,
			model: null,
			
		}
	},
	computed: {
      ...mapState({
			list: state => state.subjects.list,
		}),
		canCreate(){
			return !this.editting && !this.deleting;
		}
	},
	beforeMount(){
		this.init();
	},
	methods: {
		init(){
			this.editting = false;
			this.deleting = false;
			this.model = null;

			this.fetchData();
		},
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_SUBJECTS, this.params)
				.catch(error => {
					Bus.$emit('errors');
				})
		},
		search(){
			this.fetchData();
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_SUBJECT)
				.then(model => {
					this.model = model;  
					this.editting = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
			
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_SUBJECT, id)
				.then(model => {
					this.model = model;  
					this.editting = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
      cancelEdit(){
			this.model = null;  
         this.editting = false;
		},
		remove(){
			this.deleting = true;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_SUBJECT, id)
				.then(() => {
					this.init();
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
		cancelDelete(){
			this.deleting = false;
		},
      submit(){
			this.$store.commit(CLEAR_ERROR);
			let action = this.model.id ? UPDATE_SUBJECT : STORE_SUBJECT;
         this.$store.dispatch(action, this.model)
				.then(() => {
					this.init();
					Bus.$emit('success');
				})
				.catch(error => {
					if(!error)  Bus.$emit('errors');
					else this.$store.commit(SET_ERROR, error);
				})
		}
	}
}
</script>