import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Vue.use(Vuex);

// firebase
const config = {
  apiKey: "AIzaSyAP73cduIt9p9WHxv3vpxOkNnhzPV8G18U",
  authDomain: "formidable-61163.firebaseapp.com",
  databaseURL: "https://formidable-61163.firebaseio.com",
  projectId: "formidable-61163",
  storageBucket: "formidable-61163.appspot.com",
  messagingSenderId: "968197839064",
  appId: "1:968197839064:web:f1dc880e9d63e8cc5a5fad",
  measurementId: "G-6B0G0XLEGG"
};
firebase.initializeApp(config);

// Get a reference to the database service
const auth = firebase.auth();

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    admin: null,
    db: firebase.database(),
    config: config
  },
  mutations: {
    setAdmin(state, payload) {
      if (payload) {
        state.admin = payload.user;
        state.isLoggedIn = true;
        console.log('firebase logged in.');
      } else {
        state.admin = null;
        state.isLoggedIn = false;
        console.log('firebase logged out.');
      }
    }
  },
  actions: {
    async login(context, payload) {
      try {
        const res = await auth.signInWithEmailAndPassword(payload.email, payload.password);
        console.log(res);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async logout() {
      await auth.signOut();
    }
  }
})
