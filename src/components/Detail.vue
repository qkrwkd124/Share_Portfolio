<template>
<v-flex>
  <v-container>
  <v-card tile="" dark="" class="c">
    <v-img :src="imgSrc" height="500px" weight="500px;">
    </v-img>
	
    <v-card-title primary-title>
      <div>
        <div id="koreaT" class="headline">{{title}}</div>
      </div>
    </v-card-title>
    <v-card-text>
        <div class="grey--text text-right">{{date}}</div> 
        <span id="korea">{{body}}</span>
    </v-card-text>
    <v-card-actions>
            <v-btn flat color="orange" @click="bookmark">즐겨찾기</v-btn>
            <v-btn flat color="orange" href="/">뒤로가기</v-btn>
            <v-btn v-if="writerTF" flat color="orange" @click="update">수정</v-btn>
            <v-btn v-if="writerTF" flat color="orange" @click="portdelete">삭제 </v-btn>
    </v-card-actions>
  </v-card>
  </v-container>
</v-flex>
</template>

<script>
import FirebaseService from '../services/FirebaseService';
import firebase from 'firebase'

export default {
	name: 'Portfolio',
	props: {
    
		date: {type: String},
		title: {type: String},
		body: {type: String},
    imgSrc: {type: String},
    portid : {type:String,required: true}
	},
	data() {
		return {
      somevar : this.portid,
      writerTF : false
		}
    },
    mounted() {
      this.loginCheck();
    },
    methods : {
      bookmark : function(){
           
    var bookmarkURL = window.location.href;
    var bookmarkTitle = document.title;
    var triggerDefault = false;

    if (window.sidebar && window.sidebar.addPanel) {
        // Firefox version &lt; 23
        window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') < -1)) || (window.opera && window.print)) {
        // Firefox version &gt;= 23 and Opera Hotlist
        var $this = $(this);
        $this.attr('href', bookmarkURL);
        $this.attr('title', bookmarkTitle);
        $this.attr('rel', 'sidebar'); 
        $this.off(e);
        triggerDefault = true;
        } else if (window.external && ('AddFavorite' in window.external)) {
        // IE Favorite
        window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        } else {
        // WebKit - Safari/Chrome
        alert((navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D 를 이용해 이 페이지를 즐겨찾기에 추가할 수 있습니다.');
        }

        return triggerDefault;
    },
    update(){
        var m = this.$modals.open({
      title: '포트폴리오 글쓰기',
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
        if(m.getItem('mainimage').value == ''){
          FirebaseService.updatePort(m.getItem('title').value,m.getItem('content').value,vm.imgSrc,vm.portid);
          location.reload(true);
        }else{

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
            console.log(vm.portid);
    
            FirebaseService.updatePort(m.getItem('title').value,m.getItem('content').value,result.data.link,vm.portid);
            alert('수정 되었습니다.');
            location.reload(true);
          }
        });
      });
      }
        
  		m.loaded()
    },500)
    })

    m.onreload( () => {
  	console.log('Reloaded')
    })
    },
    async portdelete(){
      await FirebaseService.deletePort(this.portid);
      alert("삭제완료");
      location.href ='/portfolio';
      
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

    }
}
</script>

<style>
    .c{
       position: absolute;
       left:10%;
       right: 10%;
       
    }
</style>

  