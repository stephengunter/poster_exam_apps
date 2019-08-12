import Vue from 'vue';
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';


Vue.use(Vuetify, {
	iconfont: 'mdi',
	theme:{
		primary: '#4caf50',
		secondary: '#4caf50',
		tertiary: '#495057',
		accent: '#82B1FF',
		error: '#f55a4e',
		info: '#00d3ee',
		success: '#5cb860',
		warning: '#ffa21a'
	}
})


