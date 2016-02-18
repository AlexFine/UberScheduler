

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

.controller('ridesCtrl', function ($scope, $ionicPopup, $timeout) {
    //MODAL SHIZ STUFF FOR UI BOOTSTRAP
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };


    $scope.toggleShow = function (index) {
        for (var i = 0; i < $scope.scheduledRides.length; i++) {
            if (i == index) {
                var previous = $scope.scheduledRides[i].showOptions;
                $scope.scheduledRides[i].showOptions = !previous;
                // console.log("Toggling to:", !previous); //Feedback
            }
        }
    };

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
        $scope.scheduledRides[parent].nextRide = $scope.findNextRide(rideTime, daysOfWeek);
        // console.log($scope.scheduledRides[parent].nextRide); //Feedback
    };

    $scope.findNextRide = function(rideTime, daysOfWeek) { //Now using node package: 'later'
      //Doesn't incorporate start/end date of schedule

      var arrayOfDays = [];
      for (var i = 0; i < daysOfWeek.length; i++) {
        if (daysOfWeek[i]) { //if that day is true
          arrayOfDays.push(i + 1); //'later' uses a 1-7 scale not a 0-6
        }
      }
      // console.log("Days of week:", arrayOfDays)

      /*  Check if there is indeed a recurring schedule  */
      if (arrayOfDays.length == 0) { //If there is no recurring part of the schedule
        return undefined; //Return nothing
      }

      var x = new Date();
      var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
      var hour = new Date(rideTime).getHours();

      var maxHour = 24 - currentTimeZoneOffsetInHours;

      // console.log("Hour:", hour);

      //It always sets the hours 8 hours too few after compiling the schedule because of the timezone
      if (hour <= maxHour) {
        hour += currentTimeZoneOffsetInHours; //Add 8 to compensate
      } else {
        var num = hour + currentTimeZoneOffsetInHours;
        hour = num % 24;
      }
      // console.log("Updated hour:", hour);

      var minutes = new Date(rideTime).getMinutes();

      var schedule = {
        schedules: [
          {
            h: [hour],
            m: [minutes],
            dw: arrayOfDays
          }
        ]
      };
      // console.log(schedule.schedules[0].h); //Debugging

      var compiledSchedule = later.schedule(schedule);
      // console.log("Compiled schedule");
      // console.log(compiledSchedule);
      var nextRide = compiledSchedule.next(1); //Next instance of schedule

      if (nextRide.getHours() >= maxHour) { //Compensating because it's so jank
        nextRide.setDate(nextRide.getDate() + 1); //Add a day
        var previousRide = compiledSchedule.prev(1);
        previousRide.setDate(previousRide.getDate() + 1);
        var currentDate = new Date();
        // console.log(previousRide.getTime())
        // console.log(currentDate.getTime())
        if (previousRide.getTime() > currentDate.getTime()) { //If the previous ride should be the current ride
          // console.log(previousRide)
          nextRide = previousRide;
        }
      }

      // console.log(nextRide);
      return nextRide; //Return the date and time of the next ride
    };

    $scope.timeUntilDate = function(a, returnType) {
      var firstDate = new Date(); //Current time
      var secondDate = new Date(a); //Input time

      // http://stackoverflow.com/questions/8528382/javascript-show-milliseconds-as-dayshoursmins-without-seconds
      var t = Math.abs(secondDate.getTime() - firstDate.getTime()); //Milliseconds between the time
      var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000,
      d = Math.floor(t / cd),
      h = Math.floor( (t - d * cd) / ch),
      m = Math.round( (t - d * cd - h * ch) / 60000),
      pad = function(n){ return n < 10 ? '0' + n : n; };
      if( m === 60 ){
        h++;
        m = 0;
      }
      if( h === 24 ){
        d++;
        h = 0;
      }
      // console.log([d, pad(h), pad(m)].join(':')); //Feedback
      if (returnType == "string") {
        var dayLabel = " days, ";
        if (d == 1) { //If only one day
          dayLabel = " day, ";
        }
        var hourLabel = " hours, ";
        if (h == 1) { //If only one day
          hourLabel = " hour, ";
        }
        var minuteLabel = " minutes";
        if (m == 1) { //If only one day
          minuteLabel = " minute";
        }
        return (
          d +  dayLabel + h + hourLabel + m + minuteLabel
        )
      } else {
        return [d, pad(h), pad(m)].join(':');
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
      // console.log("Adding new scheduled rides");
      var currentTime = new Date().getTime(); //Number of seconds since Jan 1, 1970
      var defaultRepeat = [false, true, false, true, false, true, false];
      $scope.scheduledRides.push(
        {
          time: currentTime,
          pickupLocation: [34.07636433, -118.4290661],
          pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"], //Will declare this variable when the location is selected on the map
          dropLocation: [34.07636433, -118.4290661],
          dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
          repeatedDays: defaultRepeat,
          startDate: new Date(2016, 01, 01), //Months indexed from 0
          endDate: new Date(2016, 3, 01),
          nextRide: $scope.findNextRide(currentTime, defaultRepeat),
          product: 1,
          showOptions: true //Show options when adding new schedule
        }
      )
    };

    $scope.pushRidesToServer = function() {

      /*********      Conversions     *********/
      //Convert the nextRide variable into a number readable by the server
      //Convert the time variable into an integer
      var data = $scope.scheduledRides; //The data variable will be sent
      for (var i = 0; i < data.length; i++) {
        //time conversion
        var time = data[i].time;
        var ray = [time.getHours(), time.getMinutes()];
        data[i].time = ray; //Assign to object

        //nextRide conversion
        var nextRide = data[i].nextRide;
        var num = Date.parse(nextRide);
        data[i].nextRide = num; //Assign to object
      };
      /*********      Conversion Complete     *********/
      console.log("Sending data:") //Feedback
      console.log(data)

      /*********      Pushing to Server     *********/
    };

    $scope.UberTypes = ["UberX", "UberBlack", "UberBlack", "ACCESS"];
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
          nextRide: new Date($scope.findNextRide(new Date(2016, 0, 1, 2, 3, 4, 567), [false, true, false, true, false, true, false])), //Calculated on spot because these are tests
          product: 1,
          showOptions: true
        },
        {
          time: new Date(2016, 0, 1, 18, 32, 5, 567),
          pickupLocation: [34.07636433, -118.4290661],
          pickupName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
          dropLocation: [34.07636433, -118.4290661],
          dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
          repeatedDays: [false, true, false, true, false, true, false],
          startDate: new Date(2016, 01, 01),
          endDate: new Date(2016, 4, 01),
          nextRide: new Date($scope.findNextRide(new Date(2016, 0, 1, 18, 32, 5, 567), [false, true, false, true, false, true, false])),
          product: 2,
          showOptions: false
        }
      ];
      //POPUP SEXY ACTION STUFF
      // Triggered on a button click, or some other target

      // A confirm dialog
      $scope.selectDate = function(varToChange, scheduleNum) {

        var previousValue;

        switch (varToChange) {
          case "startDate":
            previousValue = new Date($scope.scheduledRides[scheduleNum].startDate);
            break;
          case "endDate":
            previousValue = new Date($scope.scheduledRides[scheduleNum].endDate);
            break;
          default:
            console.log("Found no variable to change")
        }

         var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
         var dateString = days[previousValue.getDay()] + ", " + months[previousValue.getMonth()] + ", " + previousValue.getDay() + ", " + previousValue.getFullYear();


         var calendarPopup = $ionicPopup.alert({
           title: 'Please Select a Date',
           template: '<h5>Previous Date: ' + dateString + '</h5><h5>Date Selected: <span id="dateValue">{{dt | date:"fullDate" }}</span></h5><div style="display:inline-block; min-height:290px;">' +
           '<uib-datepicker ng-model="dt" min-date="minDate" show-weeks="true" class="well well-sm" custom-class="getDayClass(date, mode)"></uib-datepicker>' +
           '</div>',
           okText: 'Confirm',
           okType: 'button-positive'
         });

         calendarPopup.then(function(res) {
           var date = document.getElementById('dateValue').innerHTML; //The scope variable doesn't update for some reason so I'm doing something really jank
           if (date == "") { //If didn't select a date
             console.log("Did not select a date");
             date = previousValue; //Set it back to old value
           }
           $scope.dt = date; //Assign scope variable

           //The date value can be retrieved in the modal itself so I'm assigning an ID to it
           //Then I call the value of the respective tag - it gives me the correct date
           switch (varToChange) {
             case "startDate":
               console.log("Changing start date for schedule", scheduleNum, "to", date);
               $scope.scheduledRides[scheduleNum].startDate = date;
               break;
             case "endDate":
               console.log("Changing end date for schedule", scheduleNum, "to", date);
               $scope.scheduledRides[scheduleNum].endDate = date;
               break;
             default:
               console.log("Found no variable to change")
           }
         });
       };


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

.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})

//You shouldnt leave your computer open!!!! ;)
.controller('rideCtrl', function ($scope, $stateParams) {})

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
    $scope.randomName = function($scope) {
      $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
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
    .controller('DatepickerDemoCtrl', function ($scope) {

    });
