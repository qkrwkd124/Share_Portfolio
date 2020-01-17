
<template>
  <div>
    <MyHeader></MyHeader>
    <check></check>

    <!-- <ImgBanner imgSrc="selectImage"> -->
    <div class="btn-outline-primary banner mt-4"><button @click="changeBanner">ChangeBanner</button></div>
    <ImgBanner :imgSrc="imgUrl">
      <div style="line-height:1.2em;" slot="text">
        3인조의 블로그
        <br />너와 함께라면
      </div>
    </ImgBanner>
    
    <v-container>
      <!-- <uploadImage :showImg="showImg" @childs-event="parentMethod"></uploadImage>
      <button @click="changeBanner">RandomBanner</button> -->
      <uploadImage class="btn-outline-primary" @childs-event="parentMethod"></uploadImage>
      
      <!-- About Me -->
      <v-layout my-5>
        <v-flex xs12 md8 text-xs-center text-md-left>
          <h2 class="headline mb-3">About Me</h2>
          <p class="mr-4">안녕하세요, 3인조의 블로그 입니다 <br/>함께 프로젝트를 진행하게 되어서 기쁩니다. Vue가 쉽고 간단하고 좋다던데 생각보다 어려워서 많이 힘들었네요
          기본적인 개념이 안잡혀있으면 어떤것을 하더라도 어려운것 같습니다. 다같이 힘내봐요
            </p>
              
        </v-flex>
        <v-flex xs0 md4>
          <v-img :src="getImgUrl('profile.png')" aspect-ratio="1.5" />
        </v-flex>
      </v-layout>

      <!-- Portfolio -->
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center">Portfolio</h2>
          <PortfolioList></PortfolioList>
        </v-flex>
      </v-layout>

      <!-- Post -->
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center">Post</h2>
          <PostList></PostList>
        </v-flex>
      </v-layout>

      <!-- Github -->
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center">Project</h2>
          <RepositoryList></RepositoryList>
        </v-flex>
      </v-layout>
    </v-container>
    <MyFooter></MyFooter>
    <p class="btn_top">
      <i class="arrow up"></i>
    </p>
  </div>
</template>

<script src="scripts/jquery-1.6.2.min.js"></script>

<script>
import ImgBanner from "../components/ImgBanner";
import PortfolioList from "../components/PortfolioList";
import PostList from "../components/PostList";
import RepositoryList from "../components/RepositoryList";
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";
import check from "../components/checkbrowser";
import uploadImage from "../components/uploadImage";
import FirebaseService from "../services/FirebaseService";
import firebase from 'firebase';

export default {
  name: "HomePage",
  data() {
    return {
      selectImage: "https://source.unsplash.com/collection/190727/1600x900",
      imgUrl: "https://source.unsplash.com/5brvJbR1Pn8/1600x900",
      showPhoto: false
    };
  },
  components: {
    ImgBanner,
    PortfolioList,
    PostList,
    RepositoryList,
    MyHeader,
    MyFooter,
    check,
    uploadImage
  },
  props:{
  },
  mounted() {
    
  },
  methods: {
    getImgUrl(img) {
      return require("../assets/" + img);
    },
    parentMethod(input) {
      this.imgUrl = input;
      ImgBanner.imgSrc = this.imgUrl;
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
    async test(){
    }
  }
};
</script>

<style>
.banner {
  position:absolute;
  top: 30px;
  right: 5px;
  z-index: 1;
}
.btn_top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 30px;
  height: 30px;
  background: #555;
  border-radius: 30px;
  color: #fff;
  line-height: 50px;
  display: none;
}

p i {
  border: solid white;
  border-width: 0 5px 5px 0;
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: 20%;
  right: 23%;
  display: inline-block;
  padding: 3px;
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.bodyfont {
  font-size: 1vw;
}
</style>
