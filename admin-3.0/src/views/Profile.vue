<template>
   <core-container>
      <profile-edit v-if="user" :user="user" :model="model"
      @submit="submit"
      />
   </core-container>
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
         model: { password: '' }
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