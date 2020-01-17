<template>
<v-layout>
  <v-card 
  min-width="100%"
  >
    <v-img :src="imgSrc" height="200px">
    </v-img>
	
    <v-card-title primary-title>
      <div>
        <div class=" portbody">{{title}}</div>
		<v-divider class="divider"></v-divider>
        <span class="grey--text portbody">{{body}}</span>
      </div>
    </v-card-title>
  </v-card>
</v-layout>
</template>

<script>
export default {
	name: 'Portfolio',
	props: {
		date: {type: String},
		title: {type: String},
		body: {type: String},
		imgSrc: {type: String},
	},
	data() {
		return {
			//
		}
	}
}
</script>
<style>
	.portbody {
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
	.divider{
		margin : 10px;
	}
</style>

