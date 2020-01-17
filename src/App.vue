<template>
  <v-app>
    <v-content>
      <router-view/>
      <!-- chatBot button -->
      <v-btn class="chatBtn" @click="toggleOnOff" fixed bottom right fab dark color="#17A2B8">
        <v-icon dark>android</v-icon>
      </v-btn>
    </v-content>

    <!-- chatbot -->
    <div v-show="isChatBotOn" class="chatMessage">
      <iframe
        allow="microphone;"
        width="350"
        height="430"
        src="https://console.dialogflow.com/api-client/demo/embedded/0296aa7e-81b8-4816-b139-26c3ffa17f2e">
      </iframe>
    </div>

    <!-- top button -->
    <back-to-top bottom="80px" right="16px" id="TopLocation">
      <button type="button" class="btn btn-info btn-to-top"><i class="fa fa-chevron-up"></i></button>
    </back-to-top>

  </v-app>
</template>

<script>
import store from './store'
import Header from './components/Header'
import BackToTop from 'vue-backtotop'
import firebase from 'firebase'
import FirebaseService from './services/FirebaseService';

export default {
	name: 'App',
  components: {
    BackToTop,
  },
  store,
  methods: {
    toggleOnOff: function() {
      this.isChatBotOn = !this.isChatBotOn;
      // console.log(this.isChatBotOn)
    },

  },
	data() {
		return {
			// chatbot bool
      isChatBotOn: false,
		}
	}
}
</script>

<style>
	.btn-to-top {
  width: 56px;
  height: 56px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
  }
  .chatBtn {
    z-index: 1;
  }
  .chatMessage {
    z-index: 1;
    position: fixed;
    bottom: 200px;
    right:20px;
  }
</style>
