<template>
    <div>
        <img :src="imgUrl" v-if="showImg" style="width:100%; height:300px; align-items: right"/><input name="img" type="file"/>
    </div>
</template>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script>
import FirebaseService from '../services/FirebaseService';
import "expose-loader?$!expose-loader?jQuery!jquery";
export default {
  name: 'uploadImage',
  data(){
      return {
          imgUrl: ""
      }
  },
  mounted() {
      this.changeImg();
  },
	methods: {
    async changeImg() {
       var vm = this;
      $("input[name=img]").change(function() {
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
                // if (evt.lengthComputable) {
                //   console.log(
                //     "업로드진행률:" +
                //       parseInt((evt.loaded / evt.total) * 100, 10) +
                //       "%"+"/"+temp
                //   );
                // }
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
          // console.log(result);
          // console.log("업로드결과:" + result.status);
          if (result.status != 200) {
            result = $.parseJSON(result.responseText);
          }
          if (result.data.error) {
            // console.log("지원하지않는 파일형식..");
          } else {
            FirebaseService.postImage(result.data.link);
            // console.log("업로드된 파일경로:" + result.data.link);
              vm.imgUrl = result.data.link;
              vm.$emit('childs-event', result.data.link);
          }
        });
      });
    }
  },
  props: ['showImg']
}
</script>
<style>
  .text-shadow {
    text-shadow: 0 0 15px rgb(255,255,255);
  }
</style>
