angular.module('editRideCtrl', ['ui.bootstrap', 'ridesService'])
    .controller('editRideCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, $compile, $ionicLoading, $http, findNextRide) {
        //Need to change rideEdit to editRide

        //WE BE STARTING THE CODE TO HAVE IT AUTO SUGGEST WHICH LOCATION TO CHOOSE

        var _selected;

        $scope.selected = undefined;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        // Any function returning a promise object can be used to load values asynchronously
        $scope.getLocation = function (val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        };

        $scope.ngModelOptionsSelected = function (value) {
            if (arguments.length) {
                _selected = value;
            } else {
                return _selected;
            }
        };

        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        $scope.statesWithFlags = [{
            'name': 'Alabama',
            'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'
        }, {
            'name': 'Alaska',
            'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'
        }, {
            'name': 'Arizona',
            'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'
        }, {
            'name': 'Arkansas',
            'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'
        }, {
            'name': 'California',
            'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'
        }, {
            'name': 'Colorado',
            'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'
        }, {
            'name': 'Connecticut',
            'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'
        }, {
            'name': 'Delaware',
            'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'
        }, {
            'name': 'Florida',
            'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'
        }, {
            'name': 'Georgia',
            'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'
        }, {
            'name': 'Hawaii',
            'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'
        }, {
            'name': 'Idaho',
            'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'
        }, {
            'name': 'Illinois',
            'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'
        }, {
            'name': 'Indiana',
            'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'
        }, {
            'name': 'Iowa',
            'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'
        }, {
            'name': 'Kansas',
            'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'
        }, {
            'name': 'Kentucky',
            'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'
        }, {
            'name': 'Louisiana',
            'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'
        }, {
            'name': 'Maine',
            'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'
        }, {
            'name': 'Maryland',
            'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'
        }, {
            'name': 'Massachusetts',
            'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'
        }, {
            'name': 'Michigan',
            'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'
        }, {
            'name': 'Minnesota',
            'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'
        }, {
            'name': 'Mississippi',
            'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'
        }, {
            'name': 'Missouri',
            'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'
        }, {
            'name': 'Montana',
            'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'
        }, {
            'name': 'Nebraska',
            'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'
        }, {
            'name': 'Nevada',
            'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'
        }, {
            'name': 'New Hampshire',
            'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'
        }, {
            'name': 'New Jersey',
            'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'
        }, {
            'name': 'New Mexico',
            'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'
        }, {
            'name': 'New York',
            'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'
        }, {
            'name': 'North Carolina',
            'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'
        }, {
            'name': 'North Dakota',
            'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'
        }, {
            'name': 'Ohio',
            'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'
        }, {
            'name': 'Oklahoma',
            'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'
        }, {
            'name': 'Oregon',
            'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'
        }, {
            'name': 'Pennsylvania',
            'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'
        }, {
            'name': 'Rhode Island',
            'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'
        }, {
            'name': 'South Carolina',
            'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'
        }, {
            'name': 'South Dakota',
            'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'
        }, {
            'name': 'Tennessee',
            'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'
        }, {
            'name': 'Texas',
            'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'
        }, {
            'name': 'Utah',
            'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'
        }, {
            'name': 'Vermont',
            'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'
        }, {
            'name': 'Virginia',
            'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'
        }, {
            'name': 'Washington',
            'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'
        }, {
            'name': 'West Virginia',
            'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'
        }, {
            'name': 'Wisconsin',
            'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'
        }, {
            'name': 'Wyoming',
            'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'
        }];









        //END OF WHERE IT SUGGESTS THE SEARCHBAR









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

      // Copy pasted all the junk code from schedule rides Controller



        $scope.newScheduledRide = function () {
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

        $scope.pushRidesToServer = function () {

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
          }
          ;
          /*********      Conversion Complete     *********/
          console.log("Sending data:") //Feedback
          console.log(data)

          /*********      Pushing to Server     *********/
        };

        // Modal stuff:
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


        //POPUP SEXY ACTION STUFF
        // Triggered on a button click, or some other target

        // A confirm dialog
        $scope.selectDate = function (varToChange, scheduleNum) {

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

          calendarPopup.then(function (res) {
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
        }

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
