function testUber(lat, long) {
	var xhr = new XMLHttpRequest();

	var url = "https://api.uber.com/v1/products?latitude=" + lat + "&longitude=" + long;

	xhr.open('GET', url);
	xhr.setRequestHeader("Authorization", "Token ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd");

	xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
			console.log("Request successful");
			console.log(xhr.responseText);
    }
  };

	xhr.send();

}
