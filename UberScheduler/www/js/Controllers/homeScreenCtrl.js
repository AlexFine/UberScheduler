angular.module('homeScreenCtrl', ['ui.bootstrap'])
.controller('homeScreenCtrl', function ($scope, $stateParams, $compile, $ionicLoading) {
  initialize = function () {
    console.log("Initializing Google Maps")
    var myLatlng = new google.maps.LatLng(34.07636433, -118.4290661);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true, // Disable UI controls

      // Individual UI Components
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Call Uber!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker);
    });

    $scope.map = map;
  }

  google.maps.event.addDomListener(window, 'load', initialize());

  $scope.centerOnMe = function () {
    console.log("Getting current location...")
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(myLatlng);

      alat = pos.coords.latitude;
      along = pos.coords.longitude;
      console.log(alat, along);

      // Set marker
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: $scope.map,
        title: 'Uluru (Ayers Rock)' // Don't know what this is for
      });

      $ionicLoading.hide();

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.clickTest = function () {
    alert('Will Launch Call Uber Window From here')
  };

  // }
  //ACCORDIAN CODE
  //Named this code so that it wouldn't return errors
  $scope.randomName = function ($scope) {
    $scope.groups = [];
    for (var i = 0; i < 10; i++) {
      $scope.groups[i] = {
        name: i,
        items: []
      };
      for (var j = 0; j < 3; j++) {
        $scope.groups[i].items.push(i + '-' + j);
      }
    }

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };
    //END OF ACORDIAN CODE

  }
})
