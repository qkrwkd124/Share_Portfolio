<template>
  <div>
    <Header>
    </Header>
    <div class="btn-outline-primary banner mt-4"><button @click="changeBanner">ChangeBanner</button></div>
    <ImgBanner :imgSrc="imgUrl">
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">Post</div>
    </ImgBanner>
    <v-container>
      <!-- Post -->
      <v-layout>
        <v-flex xs12>
          <PostList @Postnum="port" :limits="limitnum" :load-more="true"></PostList>
        </v-flex>
      </v-layout>

    <infinite-loading spinner="spiral" @infinite="InfiniteHandler">
      <div slot="no-more"></div>
    </infinite-loading>

    </v-container>
    <v-btn v-if="writerTF" class="writeB" @click="modalopen" fixed right fab dark color="cyan">
      <v-icon dark>edit</v-icon>
    </v-btn>


    <Footer></Footer>
  </div>
</template>

<script type="text/javascript" 
    src=" http://code.jquery.com/jquery-1.11.2.min.js">
  </script>

<script
  src="https://code.jquery.com/jquery-3.3.1.js"
  integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
  crossorigin="anonymous"></script>
<script>
import ImgBanner from '../components/ImgBanner'
import PostList from '../components/PostList'
import Header from '../components/Header'
import FirebaseService from "../services/FirebaseService"
import Footer from '../components/Footer'
import InfiniteLoading from 'vue-infinite-loading'
import firebase from 'firebase'

export default {
  name: 'PostPage',
  data() {
    return {
      selectImage: "https://source.unsplash.com/5brvJbR1Pn8/1600x900",
      imgUrl: "https://source.unsplash.com/5brvJbR1Pn8/1600x900",
      showPhoto: false,
      writerTF: false,
      limitnum: 2,
      totalnum: 0
    }
  },
	components: {
		ImgBanner,
    PostList,
    Header,
    Footer,
    InfiniteLoading
  },
  mounted(){
    this.loginCheck()
    this.buttonlocation()
  },
  methods: {
    buttonlocation: async function(){
      // console.log(document.location.pathname)
      var user = firebase.auth().currentUser;
      var toplocation = document.getElementById('TopLocation')
      if (user){
        var userauth = await FirebaseService.getOneUserInfo(user.email)
      userauth = userauth[0]
      

      if(userauth.auth != 'visitor'){
        // console.log(document.location.pathname)
        toplocation.style.bottom = "145px"
        // console.log(toplocation.style.bottom)
        
      }
      }
      

      
    },
    changeBanner() {
      this.imgUrl = this.selectImage;
      this.showPhoto = !this.showPhoto;
      if (this.showPhoto) {
        const user = FirebaseService.getUserInfo();
        if (user) {
          this.imgUrl = user.photoURL
        }
      }
    },
    async loginCheck(){
      var user = firebase.auth().currentUser;
      if (!user){
        this.writerTF = false;
        return;
      }

      var userauth = await FirebaseService.getOneUserInfo(user.email)
      userauth = userauth[0]
    
      if (userauth.auth != 'visitor'){
        this.writerTF = true;
      }
    },
    port(num){
      this.totalnum = num;
    },
    InfiniteHandler($state) {
      
      setTimeout(() => {
        if (this.limitnum < this.totalnum){
          if (this.limitnum +2 < this.totalnum){
            this.limitnum += 2;
          }else{
            this.limitnum = this.totalnum;
          }
          $state.loaded();
        }else {
          $state.complete();
        }
      }, 1000);
      
    },
    modalopen(){
      var m = this.$modals.open({
        title: '포스트 글쓰기',
        text: "your alert Text",
        theme: 'osx',
        items:[
            {
                label: '제목(20자)',
                name: 'title',
                type: 'text',
                value: '',
            },
            {
                label: '내용',
                name: 'content',
                type: 'textarea',
                value: '',
            }
            
        ]
      });
      m.open();

      m.onsave( (m) => {
      m.loading();
      setTimeout(async () => {
          if(m.getItem('title').value.length > 20){
            alert('제목이 너무 길어요 20자로 줄여주세요')
            m.loaded()
            return;
          }

          FirebaseService.postPost(m.getItem('title').value,m.getItem('content').value)
          alert('업로드 되었숨돠');
          var pushtokens = await FirebaseService.getPushTokens();
          for(var i in pushtokens){
            FirebaseService.pushAlarm(pushtokens[i].currentToken, m.getItem('title').value, m.getItem('content').value);
          }
          location.reload(true);
        m.loaded()
      },1500)
      })
      m.onreload( () => {
      console.log('Reloaded')
      })
    }

  }
}
$(document).ready(function (){
    $('input').on(onchange="this.select(); document.getElementById('filetext').value=document.selection.createRange().text.toString();")
});
</script>
<style>
  .banner {
    position:absolute;
    top: 30px;
    right: 5px;
    z-index: 1;
  }
  .writeB{
  
    right :16px;
    bottom : 80px;
  }
  .col{
    width:50px;
  }
</style>
