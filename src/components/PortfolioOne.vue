<template>
  <div>
   
    <v-flex class="hh" xs12 m12 sm6>
      <Portfolio class="ma-3" 
              :date="portfolios[this.number - 1].created_at.toString()"
              :title="portfolios[this.number- 1].title"
              :body="portfolios[this.number - 1].body"
              :imgSrc="portfolios[this.number- 1].img"
			  :portid="portfolios[this.number-1].id"
      ></Portfolio>
    </v-flex> 
    
	 <v-layout class="marg">
        <v-flex sm10>
            <v-textarea
              label="Comment"
              auto-grow
              outlined
              rows="1"
              row-height="15"
              counter="100"
              id="commentid"
              v-model="commentbody"
            ></v-textarea>
          </v-flex>
          
          <v-btn color="primary" @click="commentadd" >등록
              <v-icon dark right>check_circle</v-icon>
            </v-btn>
          

          <v-snackbar
              v-model="show"
              :timeout=2000
              
            >
              6글자 이상을 적어주세요.
            </v-snackbar>

          <v-snackbar
              v-model="commentlogin"
              :timeout=2000
            >
              로그인 하셔야 합니다.
            </v-snackbar>
          
       </v-layout>
       

        <v-layout mt-5 class="marg">
          <div class="overflow-auto" id="tablediv">


            <b-table
              id="my-table"
              :items="items"
              :per-page="perPage"
              :current-page="currentPage"
			        :fields="fields"
              :sort-direction ="sortDesc"
            >
          
            <template slot="수정삭제" slot-scope="row" >
             <span><b-button size="sm" class="mr-2" v-if="row.item.use" @click="row.toggleDetails">수정</b-button></span>
             <span><b-button size="sm" class="mr-2" v-if="row.item.use" @click="nowcheck(row.item.id)">삭제</b-button></span>
            </template>

            <template slot="row-details" slot-scope="row">
              <b-row class="mb-2">
                  <v-textarea
                    id ="cupdateid"
                    solo
                    name="input-7-4"
                    v-model="row.item.내용"
                  ></v-textarea>
                  <v-btn class="bcss" @click="commentupdate(row.item.id,row.item.내용)">수정하기</v-btn>
              </b-row>
            </template>
            </b-table>

            <b-pagination 
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>

        </div>

        </v-layout>
    
        <v-dialog
      v-model="dialog"
      dark
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">진정 삭제하시겠습니까?</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            small=""
            text
            @click="commentdelete(nowid)"
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

  </div>
</template>
<script>
import Portfolio from '@/components/Detail'
import FirebaseService from '@/services/FirebaseService'
import firebase from 'firebase'


export default { 
	name: 'PortfolioOne',
	props: {
	limits: {type: Number, default: 3},
    loadMore: {type: Boolean, default: false}
	},
	data() {
		return {
			portfolios: [],
			number : 0,
			perPage: 5,
			currentPage: 1,
      commentbody : '',
      commentupdatebody : '',
      sortDesc : 'desc',
      fields: [{key:'아이디', label:'아이디'},
               {key:'내용', label:'내용'},
               {key:'글쓴날',label:'글쓴날', class:'datecss'},
               {key:'수정삭제',label:''}],
      items: [],
      show : false,
      commentlogin : false,
      nowid : '',
      dialog : false,
			
		}
	}, 
	components: {
		Portfolio,
		
	},
	mounted() {
    this.getPortfolios()
		this.number =  this.$route.query.nid
		
	},
	computed: {
      rows() {
        return this.items.length
      }
    },
	methods: {
		async getPortfolios() {                  
      var user = firebase.auth().currentUser;
      let userauth;
      if (user){
        userauth = await FirebaseService.getOneUserInfo(user.email);
        userauth = userauth[0]
      }
      this.portfolios = await FirebaseService.getPortfolios()
      this.items = await FirebaseService.getcomment(this.portfolios[this.number-1].id);
      this.items = this.items.reverse()
      
       for(var num = 0; num < this.items.length; num++){
          if (user.email == this.items[num].아이디 || userauth.auth == 'admin'){
            this.items[num].use = true
                  
            }else{
              this.items[num].use = false
           }  
            }
      
      // console.log(userauth)
      if (user){
        for(var num = 0; num < this.items.length; num++){
          if (user.email == this.items[num].아이디 || userauth.auth == 'admin'){
            this.items[num].use = true
          
          }else{
            this.items[num].use = false
          }  
        }
      }
      
			// console.log(this.portfolios)
			// console.log(this.items)
		},
		async getComments() {
			// console.log(this.portfolios[this.number-1].id);
			this.items = await FirebaseService.getcomment(this.portfolios[this.number-1].id);
			
		},
		commentadd(){
      var user = firebase.auth().currentUser;
      
     // console.log(this.commentbody.length)
     if(this.commentbody.length <= 5){
       this.show = true;
       return;
     }

			if(user){
        FirebaseService.postcomment(this.portfolios[this.number-1].id,user.email,this.commentbody)
        this.getPortfolios()
        this.commentbody =''
			}else{
				this.commentlogin=true;
			} 
    },
    commentupdate(cid,cbody){
      FirebaseService.updatecomment(this.portfolios[this.number-1].id,cid,cbody)
      this.getPortfolios()
     },
    commentdelete(cid){
      FirebaseService.deleteComment(this.portfolios[this.number-1].id,cid)
      this.dialog = false
      this.getPortfolios()
    },
    nowcheck(cid){
      this.dialog = true
      this.nowid = cid;
    }
	},
}
</script>
<style>
	@media(max-width:480px){
  .mw-700 {
    margin: auto;
	width:auto;
	float:none;
  }
	}

	.hh{
		height:720px;
	}
 
	.marg{
    margin-top : 10%;
    margin-left: 120px;
    margin-right: 120px;
  }
  tr th:nth-child(1){
    width:150px;
  }
  tr td:nth-child(1){
    width:150px;
  }
  tr th:nth-child(2){
    width:600px;
  }
  tr td:nth-child(2){
    width:600px;
  }
  tr th:nth-child(3){
    width:130px;
  }
  tr td:nth-child(3){
    width:130px;
  }
  .datecss{
    color:gray;
  }
  .bcss{
    margin-left:-0px;
    height:115px;
    margin :0px;
    outline: none;
  }
</style>
