<template>
    <div>
        도시 : {{ city }}<br/>
        온도 : {{ temperature }}<br/>
        날씨 : {{ weatherMain }}
    </div>
</template>

<script>
export default{
    name:'Weather',
    data(){
        return{
            dataObj: null,
            city: '',
            temperature: null,
            weatherMain: '',
            latitude: 0.0,
            longitude: 0.0,
            apikey: 'd09ce327d97c55052b9bbf1dd73d11e3' //openweathermap에서 발급한 자신의 apikey 입력
        }
    },
    methods:{
        getLocation: function () {
            if (!navigator.geolocation) {
                this.errorMsg = "Geolocation is not supported by your browser";
                this.city = this.errorMsg;
                console.warn(this.errorMsg);
                return;
            }
            var options = { timeout: 10000 };
            navigator.geolocation.getCurrentPosition(this.success, this.error, options);
        },
        success: function (position) {
            // console.log(position);
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.latitude = parseFloat(this.latitude).toFixed(2);
            this.longitude = parseFloat(this.longitude).toFixed(2);

            this.getWeather();
        },
        error: function (err) {
            this.errorMsg = "Unable to retrieve your location";
            this.city = this.errorMsg;

            console.warn(`ERROR(${err.code}): ${err.message}`);
            console.warn(this.errorMsg);
        },
        getWeather: function(){
            var reqURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + this.latitude + '&lon=' + this.longitude + '&APPID=' + this.apikey;

            this.$http.get(reqURL, {headers: {'x-requested-with': 'XMLHttpRequest'}}).then(function (response) {
                this.dataObj = response.data;
                this.temperature = (this.dataObj.main.temp - 273.15).toFixed(0);
                this.city = this.dataObj.name + ', ' + this.dataObj.sys.country;
                this.weatherMain = this.dataObj.weather[0].main;
                // console.log(response);
            }, function (response) {
                // console.log('error');
                // console.log(response);
                this.errorMsg = "Unable to retrive weather information.";
            });
        }
    },
    created(){
        this.getLocation();
    }
}  
</script>

<style>

</style>
