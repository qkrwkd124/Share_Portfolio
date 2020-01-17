
<template>
    <div class="footer">
      <v-layout row wrap class="pt-3">
      <v-flex xs12 md4>
        <p>copyright 3인조</p>
        <p>2019.07.08 ~ 2019.07.19</p>
      </v-flex>
      <v-flex xs12 md4>
        <Weather></Weather>
      </v-flex>
      <v-flex xs12 md4 class="mt-2">
        <a href="https://lab.ssafy.com/piie/webmobile-sub2" style="color: #fff">
          Git
          <br>
          https://lab.ssafy.com/piie/webmobile-sub2
        </a>
      </v-flex>
    </v-layout>
  </div>    
</template>

<script>

import Weather from './Weather'

export default {
  components :{
    Weather
  }
}
</script>


<style>
.footer {
  background-color: #272727;
  color: #fff;
  
  position: relative;
  text-align: center;
}
</style>
