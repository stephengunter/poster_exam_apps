<template>
	<v-container fill-height fluid>
		Home 

	   <a href="#" @click.prevent="test">Test</a>	
<v-dialog
      v-model="dialog"
      max-width="480"
    >
      <v-card>
        <v-card-title >Use Google's location service?</v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</v-container>
</template>

<script>
export default {
	name: 'HomeView',
	data() {
		return {
			dialog: false,
		}
	},
	beforeMount() {
		
	},
	methods: {
		test() {
			this.dialog = true;
		}
	}
}
</script>
