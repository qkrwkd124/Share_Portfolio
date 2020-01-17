<template>
  <div  v-if = "check()">
    <b-alert show>Default Alert</b-alert>
    <b-alert variant="success" show>Chrom을 이용하세요</b-alert>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false
      }
    },

    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      },
      check:() => {
        let chk = navigator.userAgent.toLowerCase();
        if(chk.indexOf("chrome") > -1){
          return false;
        }else{
          return true;
        }
      }

    }
  }


</script>