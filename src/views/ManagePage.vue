<template>
  <div>
    <MyHeader></MyHeader>
    <check></check>

    <v-container>

      <v-layout my-5 justify-center="true">
        <h1>Manage Page</h1> 
      </v-layout> 
      <!-- 회원 관리 -->
      <v-layout my-5 justify-center="true">
        <v-flex xs12 md8 text-xs-center text-md-center>
          <h2 class="headline mb-3">회원 관리</h2>
          <div>
            <b-table selectable :select-mode="selectMode" striped hover :items="UserInfos" :fields="authfields" @row-selected="rowSelected"></b-table>
          </div>
          <div id="menu" class="row">  
            <ul class="update">
            <li class="updateitem">
              <p style="margin-top: 0.5rem;">e-mail: </p>
            </li>
            <li class="updateitem rowsel">
              <p style="padding-top: 1rem; padding-bottom: 0;">{{rowselected}}</p>
            </li>

            <li class="updateitem">
              <p style="padding-left:3rem; margin-top: 0.5rem;">권 한: </p>
            </li>

            <li class="updateitem">
              <b-form-select v-model="dropselected">
                <option :value="null">선택</option>
                <option value="admin">admin</option>
                <option value="team">team</option>
                <option value="visitor">visitor</option>
              </b-form-select>
              <!-- <a>{{dropselected}}</a> -->
              
            </li>

            <li class="updateitem">
              <b-button style="padding-left: 2rem; padding-right: 2rem; margin-left:3rem;" variant="outline-primary" @click="updateAuth">저 장</b-button>
            </li>
          </ul>
          </div> 
        </v-flex>
      </v-layout>

      <!-- 포스트, 포트폴리오 -->
      <v-layout my-5 justify-center="true">
        <v-flex xs12 md8 text-xs-center text-md-center>
          <h2 class="headline my-5 text-xs-center">게시글 관리</h2>
          <div>
            <b-table striped hover :items="ArticlesInfo" :fields="articlefields"></b-table>
          </div>
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
import PortfolioList from "../components/PortfolioList";
import PostList from "../components/PostList";
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";
import check from "../components/checkbrowser";
import FirebaseService from "../services/FirebaseService";
import { totalmem } from 'os';


export default {
  name: "ManagePage",
  data() {
    return {
      UserInfos: [],
      Portfolios: [],
      Posts: [],
      totalCount: 0,
      selectMode: 'single',
      rowselected: null,
      authID: "",
      dropselected: null,
      authfields:[
        {
          key: 'email',
        },
        {
          key: 'auth',
          label: '권한',
        },
        
      ],
      ArticlesInfo: [
        {
          totalnum: 0,
          postnum: 0,
          portfolionum: 0,
        }
      ],
      articlefields: [
        {
          key: 'totalnum',
          label: '전체 게시글 수',
        },
        {
          key: 'postnum',
          label: 'Post 게시글 수'
        },
        {
          key: 'portfolionum',
          label: 'Portfolio 게시글 수'
        }
      ]
    };
  },
  components: {
    PortfolioList,
    PostList,
    MyHeader,
    MyFooter,
    check,
  },
  props:{
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.UserInfos = await FirebaseService.getAllUserInfo();
      this.Portfolios = await FirebaseService.getPortfolios();
      this.Posts = await FirebaseService.getPosts();
      this.ArticlesInfo[0].totalnum = this.Portfolios.length + this.Posts.length;
      this.ArticlesInfo[0].postnum = this.Posts.length;
      this.ArticlesInfo[0].portfolionum = this.Portfolios.length;
      // this.totalCount = this.Portfolios.length + this.Posts.length;
      console.log(this.ArticlesInfo);
    },
    rowSelected(items){
      this.rowselected = items[0].email
      this.authID = items[0].id

    },
    updateAuth() {
      if(this.dropselected != null && this.rowselected != null){
        FirebaseService.updateUserInfo(this.authID, this.dropselected)
        this.getList()
      }
      // console.log("email" + this.rowselected)
    }
  }
};
</script>

<style>
.update {
  list-style:none;
  display: flex;
}
.updateitem {
		position: relative;
    padding-right: 1rem;
    margin-bottom: 0;
		/* padding-left: 3rem; */
}
.rowsel{
  background-color:white; 
  border-color:#ced4da;
  border-radius: 0.25rem; 
  border-style:solid;
  border-width:1px; 
  width: 200px;
}
.updateicon {
  margin: 0 !important;
}
.authChange {
  float: left;
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
</style>
