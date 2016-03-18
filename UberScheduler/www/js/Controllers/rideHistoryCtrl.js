angular.module('rideHistoryCtrl', ['ui.bootstrap'])
.controller('rideHistoryCtrl', function ($scope, $stateParams, $http) {

  // Create a ride
  // Construct URL
  var data = [
    { name: "elat", value: "11" },
    { name: "elong", value: "12" },
    { name: "slong", value: "11" },
    { name: "slat", value: "11" },
    { name: "ukey", value: "11" },
    { name: "time", value: "123" }
  ];
  var dataStr = "?";
  for (var i = 0; i < data.length; i++) {
    dataStr += data[i].name + "=" + data[i].value;
    if (i != data.length - 1) { // If not the last value
      dataStr += "&";
    }
  };
  var finalUrl = "https://uberscheduler-1203.appspot.com/_ah/api/uberApi/v1/uber/rideCreate" + dataStr;
  console.log(finalUrl)

  // Call API
  $http({
    method: 'GET',
    url: finalUrl
  }).then(function successCallback(response) {
      // this callback will be called asynchronously when the response is available
      console.log(response)
    }, function errorCallback(response) {
      // called asynchronously if an error occurs or server returns response with an error status.
      console.log(response)
    });

  // Get request - getTime
  console.log("Getting request")
  $http({
    method: 'GET',
    url: 'https://uberscheduler-1203.appspot.com/_ah/api/uberApi/v1/uber/getTime?slat=1231289&slong=12342123'
  }).then(function successCallback(response) {
      // this callback will be called asynchronously when the response is available
      console.log(response)
    }, function errorCallback(response) {
      // called asynchronously if an error occurs or server returns response with an error status.
      console.log(response)
    });


  // Google App Engine
  // var ROOT = 'https://uberscheduler-1203.appspot.com/_ah/api';
  // gapi.client.load('uberApi', 'v1', function() {
  //   console.log("Loaded Google App Engine API")
  // }, ROOT);
  //
  // gapi.client.uberApi.ride.create.insert({'outcome': 'WON'}).execute(function(resp) {
  //   console.log(resp);
  // });

  // Post request
  //
  // var passingVar = {
  //   "date": "112312",
  //   "elong": 213,
  //   "elat": 2131,
  //   "time": "12231",
  //   "slong": 21312,
  //   "ukey": "asd",
  //   "slat": 21312
  // };
  // var url = "https://uberscheduler-1203.appspot.com/_ah/api/uberApi/v1/datastore/createRide";
  //
  // // For creating a ride
  // $.post(url, passingVar, function(data, status) {
  //     alert("Data: " + data + "\nStatus: " + status);
  //   }
  // );
})
