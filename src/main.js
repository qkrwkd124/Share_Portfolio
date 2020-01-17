import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'expose-loader?$!expose-loader?jQuery!jquery'

import VModal from 'vue-js-modal'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'

import VueResource from 'vue-resource'
import Vuex from 'vuex'
import {EagleModal} from 'vue-eagle-modal'

Vue.config.productionTip = false

let app = '';

Vue.use(Vuetify, {
	iconfont: 'fa',
	theme: {
		primary: '#3f51b5',
		secondary: '#b0bec5',
		accent: '#8c9eff',
		error: '#b71c1c'
	}
})

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueSimplemde)
Vue.use(VModal, { dynamic: true })
Vue.use(EagleModal);

firebase.auth().onAuthStateChanged(()=>{
	if(!app){
		app = new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount('#app');
	}
})


