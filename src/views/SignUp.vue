<template>
    <div>
        <MyHeader></MyHeader>
        <ImgBanner imgSrc="https://source.unsplash.com/5brvJbR1Pn8/1600x900">
          <div style="line-height:1.2em;font-size:1.2em;" slot="text">Sign Up</div>
        </ImgBanner>
        <v-container>
            <v-layout align-center justify-center row fill-height>
                <v-flex xs8 md6 text-xs-center>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="email" placeholder="email" aria-label="email" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" v-model="password" placeholder="password" aria-label="password" aria-describedby="basic-addon2">
                    </div>
                    <button @click="signUp">Sign Up</button>
                </v-flex>
            </v-layout>
        </v-container>
        <MyFooter></MyFooter>
    </div>
</template>

<script>
import firebase from 'firebase'
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";
import ImgBanner from "../components/ImgBanner";
import FirebaseService from '@/services/FirebaseService'


export default {
	name: 'SignUp',
	data() {
        return{
            email: '',
            password: ''
        }
	},
	  components: {
        ImgBanner,
        MyHeader,
        MyFooter
    },
	methods: {
        signUp(){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                (user)=>{
                    alert('계정이 생성되었습니다.')
                    FirebaseService.setUserInfo(user.user.uid, "visitor", this.email)
                    location.href="/";
                },
                (err)=>{
                    console.log(this.email, this.password)
                    alert('에러가 발생했습니다.' + err.message)
                }
            );
        }
	}
}
</script>
