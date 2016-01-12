//hardest shit ive ever done

var xhr;
function testimate() {

var slat = alat;
var slong = along;
var url = "http://uberscheduler-1184.appspot.com/main.py";
    
//xhr.open('GET', url);
//xhr.setRequestHeader("Authorization", "Token ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd");
//xhr.send();
//xhr.onreadystatechange = function() {
//  if (xhr.readyState == 4 && xhr.status == 200) {
//      var json = JSON.stringify(eval("(" + xhr.responseText + ")"));
//      json=JSON.parse(json);
//      console.log(json);   
//    document.getElementById("estimate").innerHTML = "Next UberX in seconds: " + json['times'][0]['estimate'];
//  }
//
//}
xhttp = new XMLHttpRequest();
xhttp.open("GET", url, true);
xhttp.send();
console.log(xhttp.responseText);
}