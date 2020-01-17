<template>
  <v-layout column px-4>
	<select v-model="selected" @change="refresh" class="form-control">
		<option v-for="option in options" :value="option.value">
			{{option.text}}
		</option>
	</select>
	
	<v-flex v-for="item in repositories">
	<v-divider></v-divider>
	  <Repository :repos="item"></Repository>
    <v-divider></v-divider>
    </v-flex>
  </v-layout>
</template>
 
<script>
import Repository from '@/components/Repository'
import GitlabService from '@/services/GitlabService'

export default {
	name: 'RepositoryList',
	props: {
		limits: {type: Number, default: 5},
		loadMore: {type: Boolean, default: false}
	},
	data() {
		return {
			repositories: [],
			selected :'jgshin',
			options :[
				{text : '박윤원', value:'qkrwkd124'},
				{text : '신재근', value:'jgshin'},
				{text : '정찬미', value:'qkdrkd1994'}
			]
    }
	},
	components: {
		Repository
		
	},
	mounted() { 
		this.getGitlabRepos(this.selected)
	},
	methods: {
		async getGitlabRepos(userName) {
			const response = await GitlabService.getRepos(userName)
			if(response.status !== 200) {
				return
			}
			this.repositories = response.data
			this.repositories = this.repositories.slice(0,this.limits);
		},
		refresh : function(){
			this.repositories = []
			this.getGitlabRepos(this.selected)
			
		}
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
</style>
