angular.module('settingsCtrl', ['ui.bootstrap'])
.controller('settingsCtrl', function ($scope, $stateParams) {
  $scope.editAddress = function () {
    console.log("Testing");
  }

  $scope.updatePrefered = function (id) {
    //Update prefered Uber type
    console.log("Updating prefered Uber to " + $scope.uberTypes[id].name);
    for (var i = 0; i < $scope.uberTypes.length; i++) {
      $scope.uberTypes[i].prefered = false; //Reset all to false
    }
    $scope.uberTypes[id].prefered = true; //Set to true
  }

  $scope.uberTypes = [
    {
      name: "uberX",
      id: 0,
      prefered: true
    },
    {
      name: "uberXL",
      id: 1,
      prefered: false
    },
    {
      name: "UberBLACK",
      id: 2,
      prefered: false
    },
    {
      name: "ACCESS",
      id: 3,
      prefered: false
    },
  ]

  $scope.savedLocations = [
    {
      name: "Home",
      iconClass: "ion-android-home",
      address: "10236 Charing Cross Rd, Los Angeles, CA 90024, USA",
      LatLng: ["34.07636433", "-118.4290661"]
    },
    {
      name: "Work",
      iconClass: "ion-briefcase",
      address: "755 Ocean Ave, San Francisco, CA 94112, USA",
      latLng: ["37.722352", "-122.448918"]
    }
  ];

  $scope.connectedAccounts = [
    {
      name: "Spotify",
      iconClass: "ion-earth",
      state: true
    },
    {
      name: "Facebook",
      iconClass: "ion-earth",
      state: false
    },
    {
      name: "Twitter",
      iconClass: "ion-earth",
      state: false
    }

  ]

})
