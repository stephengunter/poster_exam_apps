<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card color="info" title="登入">
					<v-card-text>
						<v-layout row wrap>
							<v-flex sm12>
								<login-google
									@success="onGoogleLoginSuccess" @failed="oAuthLoginFailed"
								/>
							</v-flex>
						</v-layout>
					</v-card-text>
				</material-card>
			</v-flex>
     </v-layout>
	</v-container>
    
	
</template>

<script>
import { LOGIN } from '@/store/actions.type';

export default {
   name: 'LoginView',
	beforeMount(){
		this.returnUrl = this.$route.query.returnUrl;
   },
   data() {
      return {
         
      }
   },
	methods: {
      oAuthLoginFailed(){
         Bus.$emit('errors', { msg: '登入失敗' });
      },
      onGoogleLoginSuccess(token){
         this.$store
            .dispatch(LOGIN, token)
            .then(() => {
               this.onSuccess();          
            }).catch(error => {
               this.oAuthLoginFailed();
            })
      },
      onSuccess(){
         if(this.returnUrl) this.$router.push({ path: this.returnUrl });
         else this.$router.push({ path: '/' });         
      }
   },
}
</script>
