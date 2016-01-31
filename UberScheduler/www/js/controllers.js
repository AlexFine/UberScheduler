angular.module('starter.controllers', ['ui.bootstrap'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('ridesCtrl', function ($scope) {
    $scope.toggleShow = function (index) {
        for (var i = 0; i < $scope.scheduledRides.length; i++) {
            if (i == index) {
                var previous = $scope.scheduledRides[i].showOptions;
                $scope.scheduledRides[i].showOptions = !previous;
                console.log("Toggling to:", !previous); //Feedback
            }
        }
    };

    $scope.updateRepeatedDay = function (parent, child) {
        console.log("Updating days of week of schedule", parent)
        var previous = $scope.scheduledRides[parent].repeatedDays;
        for (var i = 0; i < previous.length; i++) {
            if (i == child) {
                $scope.scheduledRides[parent].repeatedDays[i] = !previous[i]; //Flip value
                console.log("Day", i, "now", !previous[i]);
            }
        }
    };

    $scope.reverseGeocode = function (lat, lng) {
        var geocoder = new google.maps.Geocoder;
        var latlng = {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        }
        console.log("Geocode lookup started")
        geocoder.geocode({
            'location': latlng
        }, function (results, status) {
            console.log("Lookup finished")
            debugger
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var address = results[1].formatted_address;
                    return address
                } else {
                    console.log("No results found");
                    return "No address found"
                }
            } else {
                console.log("Geocoder failed due to:", status);
                return "Address lookup failed"
            }
        });
    };

    $scope.newScheduledRide = function() {
      $scope.scheduledRides.push(
        {
          time: new Date(2016, 0, 1, 2, 3, 4, 567),
          pickupLocation: [34.07636433, -118.4290661],
          pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"], //Will declare this variable when the location is selected on the map
          dropLocation: [34.07636433, -118.4290661],
          dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
          repeatedDays: [false,
            true,
            false,
            true,
            false,
            true,
            false],
          startDate: new Date(2016, 01, 01), //Months indexed from 0
          endDate: new Date(2016, 3, 01),
          product: 1,
          showOptions: true //Show options when adding new schedule
        }
      )
    }

    $scope.UberTypes = ["UberX", "UberBlack", "UberBlack", "ACCESS"];
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.scheduledRides = [
        {
            time: new Date(2016, 0, 1, 2, 3, 4, 567),
            pickupLocation: [34.07636433, -118.4290661],
            pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"], //Will declare this variable when the location is selected on the map
            dropLocation: [34.07636433, -118.4290661],
            dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
            repeatedDays: [false,
              true,
              false,
              true,
              false,
              true,
              false],
            startDate: new Date(2016, 01, 01), //Months indexed from 0
            endDate: new Date(2016, 2, 01),
            product: 1,
            showOptions: false
  },
        {
            time: new Date(2016, 0, 1, 18, 32, 5, 567),
            pickupLocation: [34.07636433, -118.4290661],
            pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
            dropLocation: [34.07636433, -118.4290661],
            dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
            repeatedDays: [false,
              true,
              false,
              true,
              false,
              true,
              false],
            startDate: new Date(2016, 01, 01),
            endDate: new Date(2016, 4, 01),
            product: 2,
            showOptions: false
  }
 ];
})

//You shouldnt leave your computer open!!!! ;)
.controller('rideCtrl', function ($scope, $stateParams) {})

.controller('callRideCtrl', function ($scope, $stateParams, $compile, $ionicLoading) {
    function initialize() {
        var myLatlng = new google.maps.LatLng(34.07636433, -118.4290661);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
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
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
            alat = pos.coords.latitude;
            along = pos.coords.longitude;
            document.getElementById("lat").innerHTML = pos.coords.latitude;
            document.getElementById("long").innerHTML = pos.coords.longitude;
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function () {
        alert('Will Launch Call Uber Window From here')
    };

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
    .controller('DatepickerDemoCtrl', function ($scope) {

    });
