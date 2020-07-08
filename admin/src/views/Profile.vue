<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
         <v-flex xs12>
            <material-card>
               <v-layout row wrap v-if="user">
                  <v-flex xs12>
							<v-text-field :value="user.id" label="Id" readonly
							/>
						</v-flex>
                  <v-flex xs12>
							<v-text-field :value="user.email" label="Email" readonly
							/>
						</v-flex>
                  <v-flex xs12 v-if="model">
							<v-text-field  v-model="model.password" label="密碼"
                     v-validate="'required|min:6|max:12'"
							:error-messages="getErrMsg('password')"
							name="password"
							required
							>
                        <template v-slot:append-outer>
                           <v-btn style="top: -12px" @click.prevent="onSubmit" color="primary">設定密碼</v-btn>
                        </template>
                     </v-text-field>
						</v-flex>
               </v-layout>
               <core-error-list  />
            </material-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { USER_DETAILS, ADD_USER_PASSWORD } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR, SET_LOADING } from '@/store/mutations.type';
import { onError, resolveErrorData } from '@/utils';

export default {
   name: 'UsersView',
   data () {
      return {
         user: null,
         model: null
      }
   },
   computed: {
		...mapGetters(['currentUser'])
   },
   beforeMount(){
		this.fetchData();
	},
   methods: {
      fetchData() {
         this.$store.dispatch(USER_DETAILS, this.currentUser.id)
         .then(user => {
            this.user = user;
            if(!user.hasPassword) this.model = { password: '' };
         })
			.catch(error => {
				onError(error);
			})
      },
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('password', '密碼');
			}
			return '';
      },
      onSubmit() {
         this.$validator.validate().then(valid => {
            if(!valid) return;

            this.submit();
         })
      },
      submit() {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(ADD_USER_PASSWORD, this.model)
         .then(() => {
            this.$store.commit(SET_LOADING, true);
            Bus.$emit('success');
            setTimeout(() => {
               this.$router.push({ path: '/' });
               this.$store.commit(SET_LOADING, false);
            }, 500)
         })
         .catch(error => {
            if(!error)  Bus.$emit('errors');
            else this.$store.commit(SET_ERROR, error);
         })
      }
      
   }
}
</script>

<style>

</style>