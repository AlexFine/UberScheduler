angular.module('rideHistoryCtrl', ['ui.bootstrap', 'ridesService'])
.controller('rideHistoryCtrl', function ($scope, $stateParams, $http) {

  // Data
  data = {
    "elat": 11,
    "elong": 12,
    "slong": 21,
    "slat": 12,
    "ukey": 5066549580791808,
    "date": "21",
    "time": "12",
    "userKey":5066549580791808
  }


$scope.testapi = function() {
  
  console.log("success")
  gapi.client.uberApi.ride.creates(
    data
  ).execute(function (resp) {
    console.log("success")
    console.log(resp);
  });

}

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
