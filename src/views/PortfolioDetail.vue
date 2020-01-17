
<template>
    <div>
        
        <MyHeader>
        </MyHeader>
        
        <v-layout my-5>
        
        <Portfolio>
        </Portfolio>
        
        </v-layout>
       
    
        
    </div>
</template>



<script>
import MyHeader from '../components/Header'
import Portfolio from '../components/PortfolioOne'
import Footer from '../components/Footer'

export default {
    name : 'PortfolioDetail',
    components:{
        MyHeader,
        Portfolio,
        Footer
    },
    data () {
      return {
         
      }
    },
    
    methods:{

    }
}
</script>

<style>

</style>

