function login(){
    var url = 'https://api.uber.com/v1/products?latitude=37.7759792&longitude=-122.41823';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader("Authorization", "Token ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd");
    xhr.send();
    window.location="https://login.uber.com/oauth/v2/authorize?response_type=code&client_id=_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW";
}