<template>
  <v-layout py-4 h-100>

    <v-card
      max-width="344"
      min-width="100%"
      class="mx-auto"
    >
      <v-card-title>{{title}}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="ww">{{body}}</v-card-text>
      <v-card-actions>

        <v-menu
          v-model="menu"
          :close-on-click="false"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="indigo"
              dark
              v-on="on"
            >
            상세보기
            </v-btn>
          </template>

          <v-card
            color="grey lighten-4"
            max-width="600px"
            flat
          >
            <v-toolbar
              dark
            >
          <v-btn icon @click="updatecheckid()">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-toolbar-title v-html="title"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>favorite</v-icon>
              </v-btn>
              <v-btn icon @click="deletecheck">
                <v-icon dark>remove</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <span v-html="body"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="menu = false"
              >
              Cancel
              </v-btn>
            </v-card-actions>
          </v-card>

        </v-menu>
      </v-card-actions>
    </v-card>
      
    <v-dialog
      v-model="dialog"
      dark
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">삭제하시겠습니까?</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            small=""
            text
            @click="deletePost()"
          >
            예
          </v-btn>

          <v-btn
            color="green darken-1"
            small=""
            text
            @click="dialog = false"
          >
            아니요
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      
      <v-snackbar
         v-model="show"
         :timeout=1500
           >
     권한이 없습니다. 관리자로 로그인해주세요.
    </v-snackbar>

  </v-layout>

</template>

<script>
import FirebaseService from "../services/FirebaseService"
import firebase from 'firebase'

export default {
  data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      name: 'Post',
      dialog : false,
      show : false,
    }),
	props: {
		date: {type: Date},
		title: {type: String},
    body: {type: String},
    pid :{type:String}
	},
  computed: {
		formatedDate() {
			return `${this.date.getFullYear()}년 ${this.date.getMonth()}월 ${this.date.getDate()}일`
    }
  },
  methods:{
    updatePost(){

      var m = this.$modals.open({
      title: '포스트 수정하기',
      text: "your alert Text",
      theme: 'osx',
      items:[
          {
              label: '제목',
              name: 'title',
              type: 'text',
              value: this.title,
          },
          {
              label: '내용',
              name: 'content',
              type: 'textarea',
              value: this.body,
          }
          
      ]
    });
    m.open();

    m.onsave( (m) => {
  	m.loading();
  	setTimeout(() => {
        var vm = this;

        FirebaseService.updatePost(m.getItem('title').value,m.getItem('content').value,vm.pid)
        alert('수정 완료~');
        location.reload(true);
    
  		m.loaded()
    },1500)
    })

    m.onreload( () => {
  	console.log('Reloaded')
    })
    },
    deletePost(){
      console.log(this.pid);
      FirebaseService.deletePost(this.pid);
      location.reload(true);
    },
    async updatecheckid(){
      var user = firebase.auth().currentUser;
      if (!user){
        this.show = true
      }else{
        var userauth = await FirebaseService.getOneUserInfo(user.email)
        userauth = userauth[0]
        if (userauth.auth != 'visitor'){
          this.updatePost()
        }else{
          this.show = true
        }
      }
    },
    async deletecheck(){
      var user = firebase.auth().currentUser;
      if (!user){
        this.show = true
      }else{
        var userauth = await FirebaseService.getOneUserInfo(user.email)
        userauth = userauth[0]
        if (userauth.auth != 'visitor'){
          this.dialog = true
        }else{
          this.show = true
        }
      }
    },

  }
}
</script>
<style>
  .color-666 {
    color: #666;
  }
  .color-333 {
    color: #333;
  }
  .h-100 {
    height: 100%;
  }
  .postbody {
		display: inline-block; 
		white-space: normal; 
		line-height: 1.2; 
		height: 3.6em; 
		text-align: left; 
		word-wrap: break-word; 
		display: -webkit-box; 
		-webkit-line-clamp: 3; 
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
  .ww{
    overflow: hidden; 
 	text-overflow: ellipsis;
  	white-space: nowrap; 
    widows: 100%;
  }
  hr{
    margin : 0px;
  }
</style>

