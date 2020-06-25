import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue'
import App from './App.vue';
import router from './router';
import store from './store';
import TheNavbar from "@/components/shared/TheNavbar";
import TheFooter from "@/components/shared/TheFooter";
import toaster from "@/mixins/toaster";
import modal from "@/mixins/modal";
import VueMoment from 'vue-moment';
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

// auth change listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        store.commit('setAdmin', { user: user });
    } else {
        // No user is signed in.
        store.commit('setAdmin', null);
    }
});

Vue.use(VueMoment);
Vue.use(VueAxios, axios);

Vue.component('TheNavBar', TheNavbar);
Vue.component('TheFooter', TheFooter);

Vue.mixin(toaster);
Vue.mixin(modal);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
