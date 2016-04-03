angular.module('rideHistoryCtrl', ['ui.bootstrap', 'ridesService', 'scheduledRidesService', 'ridesService', 'geocodingService'])
.controller('rideHistoryCtrl', function ($scope, $stateParams, $http, addSchedule, findNextRide, reverseGeocode) {

    var lat = 34.07636433;
    var lng = -118.4290661;

    var data = {
      time: new Date(2016, 0, 1, 18, 32, 5, 567),
      pickupLocation: [lat, lng],
      pickupName: reverseGeocode(lat, lng).formatted_address,
      dropLocation: [34.07636433, -118.4290661],
      dropName: ["10236 Charing Cross Rd", "Los Angeles", "CA", "90024"],
      repeatedDays: [false, false, true, true, false, true, false],
      startDate: new Date(2016, 01, 01),
      endDate: new Date(2016, 4, 01),
      nextRide: new Date(findNextRide(new Date(2016, 2, 3, 23, 17, 9, 567), [false, true, false, true, false, true, false])),
      product: 2
    }
    addSchedule(data)
})
