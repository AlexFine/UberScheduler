function estimate(){
alert("working");
var slat = 37.775818;
var slong = -122.418028;

var data;

$.ajax({
    url: "https://sandbox-api.uber.com/v1/estimates/time?server_token=ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd&start_latitude=" + slat + "&start_longitude=" + slong,
    jsonp: "callback",
    //dataType: "json",
    data: {
        format: "json"
    },
    type: 'GET',
    success: function(response) {
        data = response['times'][0]['estimate']; // server response
        document.getElementById('estimate').innerHTML += 'Next UberX in seconds: ' + data;

    }
});
}