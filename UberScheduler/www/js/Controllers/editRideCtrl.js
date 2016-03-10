angular.module('editRideCtrl', ['ui.bootstrap'])
    .controller('editRideCtrl', function ($scope, $stateParams, $ionicPopup, $timeout, $compile, $ionicLoading, $http) {
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


    })
