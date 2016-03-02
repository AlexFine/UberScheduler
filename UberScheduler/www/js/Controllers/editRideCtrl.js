angular.module('editRideCtrl', ['ui.bootstrap'])
.controller('editRideCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, $compile, $ionicLoading) {
  //Need to change rideEdit to editRide



  //GOOGLE MAPS CODE
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
      // document.getElementById("lat").innerHTML = alat;
      // document.getElementById("long").innerHTML = along;

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
  //END OF GOOGLE MAPS CODE


  //Get ride ID
  $scope.rideId = $stateParams.rideId;
  console.log($scope.rideId)

  $scope.UberTypes = ["UberX", "UberBlack", "UberBlack", "ACCESS"];
  $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $scope.updateRepeatedDay = function (parent, child) {
    // console.log("Updating days of week of schedule", parent)
    var schedule = $scope.scheduledRides[parent];
    var previous = schedule.repeatedDays;
    for (var i = 0; i < previous.length; i++) {
      if (i == child) {
        $scope.scheduledRides[parent].repeatedDays[i] = !previous[i]; //Flip value
        // console.log("Day", i, "now", !previous[i]);
      }
    }
    var updatedSchedule = $scope.scheduledRides[parent];
    var rideTime = updatedSchedule.time;
    var daysOfWeek = updatedSchedule.repeatedDays;
    $scope.scheduledRides[parent].nextRide = findNextRide(rideTime, daysOfWeek);
    // console.log($scope.scheduledRides[parent].nextRide); //Feedback
  };

  //Copied from 'rides' controller - can't figure out how to access variables across different controllers
  $scope.scheduledRides = [
    {
      time: new Date(2016, 0, 1, 2, 3, 4, 567),
      pickupLocation: [34.07636433, -118.4290661],
      pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"], //Will declare this variable when the location is selected on the map
      dropLocation: [34.07636433, -118.4290661],
      dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
      repeatedDays: [false, true, false, true, false, true, false],
      startDate: new Date(2016, 01, 01), //Months indexed from 0
      endDate: new Date(2016, 2, 01),
      nextRide: new Date(findNextRide(new Date(2016, 0, 1, 2, 3, 4, 567), [false, true, false, true, false, true, false])), //Calculated on spot because these are tests
      product: 1,
      showOptions: true
    }
  ];

  $scope.configuredRide = $scope.scheduledRides[$scope.rideId];

//Controller for popup icon that gives information on what Future Rides are
  // Triggered on a button click, or some other target

  // An alert dialog
  $scope.showRemainingRides = function () {
    console.log("Hello test");
    var alertPopup = $ionicPopup.alert({
      title: 'Future Rides',
      template: 'The number of future rides you have on this schedule'
    });

    alertPopup.then(function (res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.isCollapsedPickup = true;
  $scope.isCollapsedDropoff = true;
  $scope.isCollapsedMap = true;


})

.controller('callRideCtrl', function ($scope, $stateParams, $compile, $ionicLoading) {
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
      document.getElementById("lat").innerHTML = alat;
      document.getElementById("long").innerHTML = along;

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

.controller('helpCtrl', function ($scope, $stateParams) {
  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open1 = function () {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function () {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function (year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  $scope.getDayClass = function (date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
})
