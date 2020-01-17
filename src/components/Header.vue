<template>
<div>
  <login-modal/>

  <nav class="fixed-top">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">3인조의개발블로그</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
        <b-nav-item >
          <div id="google_translate_element"></div>
        </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
          <b-nav-item  :to="{path: '/portfolio'}">Portfolio</b-nav-item>
          <b-nav-item  :to="{path: '/post'}">Post</b-nav-item>
          <b-nav-item id="managecheck" style="display: none;" :to="{path: '/manage'}">Manage</b-nav-item>
          <b-nav-item  v-if="loginCheck" @click="$modal.show('login')">Login</b-nav-item>
          <b-nav-item  v-else @click="signOut">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </nav>
</div>
</template>

<style>


body { position: static !important; top:0px !important; }	
.goog-logo-link { display:none !important; } 
.goog-te-gadget { color: transparent !important; } 

</style>




     <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import LoginModal from './LoginModal'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase'
import FirebaseService from '../services/FirebaseService';
import { Firestore } from '@google-cloud/firestore';


Vue.use(BootstrapVue)

document.onload = function () {location.reload()}
   
     
                  

export default {
  name : 'Header',
  components : {
    LoginModal,
  },
  data(){
    return {}
  },
  mounted() {
    this.manageCheck()
  },
  methods:{
    signOut: function(){
      firebase.auth().signOut().then(()=>{
        location.href="/";
      });
    },
    manageCheck: async function(){

      var user = firebase.auth().currentUser;
      if (user) {
        var userauth = await FirebaseService.getOneUserInfo(user.email);
        userauth = userauth[0]
        // console.log(userauth)
        var disp = document.getElementById('managecheck');
        if (userauth.auth == 'admin'){
          disp.style.display = "inline";
          // console.log("inline")
        }else{
          disp.style.display = "none";
          // console.log("none")
        }
      } 
    }
  },
  computed: {
    loginCheck: function(){
      var user = firebase.auth().currentUser;
      if (user) {
        return false;
      } 
      return true;
    }
  },
}

</script>


<style>
div#google_translate_element div.goog-te-gadget-simple{background-color : #17A2B8; border : solid #17A2B8; padding-top:2px;}
.goog-te-gadget-icon{display:none;}
.goog-te-menu-value span{color : rgba(255,255,255,0.5);}
.goog-te-menu-value span:nth-child(3){display:none;}
.wr{
  padding-top:4px;
}
</style>




