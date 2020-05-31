<template>
   <v-container>
		<ValidationObserver ref="observer" >
    <form>
		 <ValidationProvider v-slot="{ errors }" name="test">
        <v-text-field
          v-model="test"
          :error-messages="errors"
          label="Test"
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="name" rules="required|max:10">
        <v-text-field
          v-model="name"
          :counter="10"
          :error-messages="errors"
          label="Name"
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          label="E-mail"
          required
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="select" rules="required">
        <v-select
          v-model="select"
          :items="items"
          :error-messages="errors"
          label="Select"
          data-vv-name="select"
          
        ></v-select>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" rules="required" name="checkbox">
        <v-checkbox
          v-model="checkbox"
          :error-messages="errors"
          value="1"
          label="Option"
          type="checkbox"
          required
        ></v-checkbox>
      </ValidationProvider>

		

      <v-btn class="mr-4" @click="submit">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>
  </ValidationObserver>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { required, email, max } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

  setInteractionMode('eager');
extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

export default {
	name: 'DashboardView',
	components: {
      ValidationProvider,
      ValidationObserver,
    },
	data(){
		return {
			test: '',
			name: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: null,
		}
	},
	methods: {
      submit () {
		  this.$refs.observer.validate()
		  .then(valid => {
			//   this.$refs.observer.errors.add({
			// 	field: 'test',
			// 	msg: 'damn'
			// });
			this.$refs.observer.setErrors({
		  test: [],
		  name: []
      });
			  console.log(this.$refs.observer.errors);
		  })
		 
		  
      },
      clear () {
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = null
        this.$refs.observer.reset()
      },
    },
}
</script>

<style>

</style>