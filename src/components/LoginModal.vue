<template>
<modal name="login" transition="pop-out" :width="modalWidth" :height="400">
  <div class="box">
    <div class="box-part" id="bp-left">
      <div class="partition" id="partition-register">
        <div class="partition-title">LOGIN</div>
        <div class="partition-form">
          <form autocomplete="false">
            <div class="autocomplete-fix">
              <input type="password">
            </div>

            <input id="n-email" type="text" v-model="email" placeholder="Email">
            <input id="n-password2" type="password" v-model="password" placeholder="Password">
          </form>

          <div style="margin-top: 42px">
          </div>

          <div class="button-set">
            <button id="goto-signin-btn" @click="signIn">Sign In</button>
            <button id="register-btn" onclick="location.href='/signup';">Register</button>
          </div>

          <button class="large-btn github-btn" @click="loginWithGoogle">connect with <span>google</span></button>
          <button class="large-btn facebook-btn">connect with <span>facebook</span></button>
        </div>
      </div>
    </div>
    <div class="box-part" id="bp-right">
    </div>
  </div>
</modal>
</template>
<script>
const MODAL_WIDTH = 656
import firebase from 'firebase'
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'LoginModal',
  data () {
    return {
      email : '',
      password : '',
      modalWidth: MODAL_WIDTH
    }
  },  created () {
    this.modalWidth = window.innerWidth < MODAL_WIDTH
      ? MODAL_WIDTH / 2
      : MODAL_WIDTH
  },
  methods: {
    signIn(){
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        async (user)=>{
          alert('로그인 되었습니다.');
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
          location.href="/";
        },
        (err)=>{
          alert('에러가 발생했습니다.' + err.message)
        }
      );
    },
    async loginWithGoogle() {
			const result = await FirebaseService.loginWithGoogle()
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then((result)=>{
        location.href="/";
      }).catch((err)=>{
        alert('[Google Login Error]', error)
      })
		},
	},
  computed: {
  }
}


</script>
<style lang="scss">
$background_color: #404142;
$github_color: #DBA226;
$facebook_color: #3880FF;
.box {
  background: white;
  overflow: hidden;
  width: 656px;
  height: 400px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 0 40px black;
  color: #8b8c8d;
  font-size: 0;
  .box-part {
    display: inline-block;
    position: relative;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
    width: 50%;
    &#bp-right {
      background: url("../assets/molang.jpg") no-repeat;
      background-size: 328px 400px;
      border-left: 1px solid #eee;
    }
  }
  .box-messages {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .box-error-message {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    height: 0;
    line-height: 32px;
    padding: 0 12px;
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: white;
    background: #F38181;
  }
  .partition {
    width: 100%;
    height: 100%;
    .partition-title {
      box-sizing: border-box;
      padding: 30px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px;
      font-weight: 300;
    }
    .partition-form {
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  input[type=password],
  input[type=text] {
    display: block;
    box-sizing: border-box;
    margin-bottom: 4px;
    width: 100%;
    font-size: 12px;
    line-height: 2;
    border: 0;
    border-bottom: 1px solid #DDDEDF;
    padding: 4px 8px;
    font-family: inherit;
    transition: 0.5s all;
    outline: none;
  }
  button {
    background: white;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px;
    letter-spacing: 1px;
    font-family: "Open Sans", sans-serif;
    font-weight: 400;
    min-width: 140px;
    margin-top: 8px;
    color: #8b8c8d;
    cursor: pointer;
    border: 1px solid #DDDEDF;
    text-transform: uppercase;
    transition: 0.1s all;
    font-size: 10px;
    outline: none;
    &:hover {
      border-color: mix(#DDDEDF, black, 90%);
      color: mix(#8b8c8d, black, 80%);
    }
  }
  .large-btn {
    width: 100%;
    background: white;
    span {
      font-weight: 600;
    }
    &:hover {
      color: white !important;
    }
  }
  .button-set {
    margin-bottom: 8px;
  }
  #register-btn,
  #signin-btn {
    margin-left: 8px;
  }
  .facebook-btn {
    border-color: $facebook_color;
    color: $facebook_color;
    &:hover {
      border-color: $facebook_color;
      background: $facebook_color;
    }
  }
  .github-btn {
    border-color: $github_color;
    color: $github_color;
    &:hover {
      border-color: $github_color;
      background: $github_color;
    }
  }
  .autocomplete-fix {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
}
.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}
.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
</style>