<template>
  <v-layout row wrap mw-700>
    <v-flex v-for="i in posts.length > limits ? limits : posts.length" xs12 md4 sm6 px-3>
      <Post
              :date="posts[i - 1].created_at"
              :title="posts[i - 1].title"
              :body="posts[i - 1].body"
			  :pid="posts[i-1].id"></Post>
      <v-divider></v-divider>
    </v-flex>
    
  </v-layout>
</template>
<script>
import Post from '@/components/Post'
import FirebaseService from '@/services/FirebaseService'

export default {
	name: 'PostList',
	props: {
		column: {type: Number, default: 1},
		limits: {type: Number, default: 6},
		loadMore: {type: Boolean, default: false},
	},
	data() {
		return {
			posts: [],
			postCount : 0
		}
	},
	components: {
		Post
	},
	mounted() {
		this.getPosts()
	},
	methods: {
		async getPosts() {
			this.posts = await FirebaseService.getPosts();
			this.postCount = this.posts.length;
			// console.log("postCount" + this.postCount)
			this.$emit("Postnum", this.posts.length)
		},
		loadMorePosts() {}
	}
}
</script>
<style>
  .mw-700 {
    
    margin: auto;
  }
</style>
