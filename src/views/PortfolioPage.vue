<template id="div01">
  <div>
    <Header>
    </Header>
    <div class="btn-outline-primary banner mt-4"><button @click="changeBanner">ChangeBanner</button></div>
    <ImgBanner :imgSrc="imgUrl">
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">Portfolio</div>
    </ImgBanner>
    <v-container >
      <!-- Portfolio -->
      <v-layout>
        <v-flex xs12>
          <PortfolioList @portfolionum="port" :limits="limitnum" :load-more="true"></PortfolioList>
        </v-flex>
      </v-layout>
    <infinite-loading spinner="spiral" @infinite="InfiniteHandler">
      <div slot="no-more"></div>
    </infinite-loading>
    </v-container>

    <v-btn v-if="writerTF" class="writeB" @click="modalopen" fixed right fab dark color="cyan">
      <v-icon dark>edit</v-icon>
    </v-btn>

   
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
import PortfolioList from '../components/PortfolioList'
import Header from '../components/Header'
import FirebaseService from "../services/FirebaseService"
import InfiniteLoading from 'vue-infinite-loading'
import firebase from 'firebase'
import "expose-loader?$!expose-loader?jQuery!jquery";

export default {
  name: 'PortfolioPage',
  data() {
    return {
      selectImage: "https://source.unsplash.com/5brvJbR1Pn8/1600x900",
      imgUrl: "https://source.unsplash.com/5brvJbR1Pn8/1600x900",
      showPhoto: false,
      writerTF: false,
      limitnum: 2,
      totalnum: 0,
    }
  },
	components: {
		ImgBanner,
    PortfolioList,
    InfiniteLoading,
    Header
  },
  mounted() {
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
    async loginCheck(){
      var user = firebase.auth().currentUser;
      
      if (!user){
        this.writerTF = false;
      }else{
        var userauth = await FirebaseService.getOneUserInfo(user.email)
        userauth = userauth[0]
        if (userauth.auth != 'visitor'){
        this.writerTF = true;
        
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
      title: '포트폴리오 글쓰기',
      text: "your alert Text",
      theme: 'osx',
      items:[
          {
              label: '제목(20자)',
              name: 'title',
              type: 'text',
              value: '20자',
              
          },
          {
              label: '내용(400자)',
              name: 'content',
              type: 'textarea',
              value: '400자',
          },
          {
            label : '첨부',
            name : 'mainimage',
            type : 'file',
            value : ''
          }
      ]
    });
    m.open();

    m.onsave( (m) => {
  	m.loading();
  	setTimeout(() => {
        var vm = this;
        if(m.getItem('title').value.length > 20){
          alert('제목이 너무 길다 20자로 써주세요.')
          m.loaded()
          return;
        }
        if(m.getItem('content').value.length > 400){
          alert('내용 범위를 초과하였습니다. 400자 이내로')
          m.loaded()
          return;
        }

      $("input[name=mainimage]").toggle(function() {
        // 사용자가 파일을 변경했을때 발생됨
        var file = this.files[0];
        var form = new FormData();
        form.append("image", file);
        $.ajax({
          xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener(
              "progress",
              function(evt) {
                // 업로드상태이벤트리스너등록
                if (evt.lengthComputable) {
                  console.log(
                    "업로드진행률:" +
                      parseInt((evt.loaded / evt.total) * 100, 10) +
                      "%"+"/"+temp
                  );
                }
              },
              false
            );
            return xhr;
          },
          url: "https://api.imgur.com/3/image", // 업로드요청주소
          headers: { Authorization: "Client-ID c3eb87cc49df023" },
          type: "POST",
          data: form,
          cache: false,
          contentType: false,
          processData: false
        }).always(result => { 
          console.log(result);
          console.log("업로드결과:" + result.status);
          if (result.status != 200) {
            result = $.parseJSON(result.responseText);
          }
          if (result.data.error) {
            console.log("지원하지않는 파일형식..");
          } else {
            //FirebaseService.postImage(result.data.link);
            console.log("업로드된 파일경로:" + result.data.link);
            FirebaseService.postPortfolio(m.getItem('title').value,m.getItem('content').value,result.data.link);
            alert('업로드 되었습니다.');
            location.reload(true);
          }
        });
      });
       
      	console.log(m.getItem('title').value)
        console.log(m.getItem('content').value)
        
  		m.loaded()
    },1500)
    })

    m.onreload( () => {
  	console.log('Reloaded')
    })

    },
  
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
