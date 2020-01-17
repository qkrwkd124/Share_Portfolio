<template>
  <div class="py-3">
    <v-layout>

      <v-flex md6 xs12 sm6>
        <a :href="repos.web_url"><h2 class="font-weight-regular ww" id="gopage">{{repos.path_with_namespace}}</h2></a>
        <p class="subheading mb-1 grey--text text--darken-1 font-weight-light">{{repos.namespace.name}}</p>
		<p>commit 횟수 : {{commits.data.length}}</p>
		
		
		
      </v-flex>
	  <v-flex md6 xs0 sm6>
		 <v-sparkline
			:value="value"
			:gradient="gradient"
			:smooth="radius || false"
			:padding="padding"
			:line-width="width"
			:stroke-linecap="lineCap"
			:gradient-direction="gradientDirection"
			:fill="fill"
			:type="type" 
			:show-labels="true"
			:labels ="['7/14','7/15','7/16','7/17','7/18','7/19']"
			svgHeight = 100%
		></v-sparkline>
	</v-flex>
    </v-layout>
  </div>
</template>

<script>
import GitlabService from '@/services/GitlabService'
import { GChart } from 'vue-google-charts'

const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]

export default {
	name: 'Repository',
	props: { 
		repos: {type: null}
	},
	
	data() {
		return {
			stats: {},
			commits : {},
		
			width: 2,
			radius: 10,
			padding: 18,
			lineCap: 'round',
			gradient: gradients[5],
			value: [],
			gradientDirection: 'top',
			gradients,
			fill: false,
			type: 'trend',

	}
	},
  mounted() {
		this.drawStatGraph()
		
  },
	methods: {
		async drawStatGraph() {
			this.dates=[];
			this.commits = await GitlabService.getCommits(this.repos.id);
			for(var i=0; i< 6 ;i++){
				this.value[i] =0;
			}
			for(var i=0; i<this.commits.data.length;i++){
				var a = this.commits.data[i].created_at.substring(8,10);
				this.value[a-14] +=1;
			}
			this.value=Array.from(this.value);
		
		}
		
	},
	components: {
    	GChart
  }
	
}

</script>

<style>
	.ww{
	overflow: hidden; 
 	text-overflow: ellipsis;
  	white-space: nowrap; 
  	width: 100%;
	}

	svg{
		height: 100%;
	}
</style>

