//hardest shit ive ever done

var xhr;
function testimate() {

var slat = alat;
var slong = along;
var url = "https://sandbox-api.uber.com/v1/estimates/time?server_token=ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd&start_latitude=" + slat + "&start_longitude=" + slong;
    
xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.setRequestHeader("Authorization", "Token ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd");
xhr.send();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
      var json = JSON.stringify(eval("(" + xhr.responseText + ")"));
      json=JSON.parse(json);
      console.log(json);   
    document.getElementById("estimate").innerHTML = "Next UberX in seconds: " + json['times'][0]['estimate'];
  }

}
}