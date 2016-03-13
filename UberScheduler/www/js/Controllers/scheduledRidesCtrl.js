angular.module('scheduledRidesCtrl', ['ui.bootstrap', 'ridesService', 'geocodingService', 'timeService', 'scheduledRidesService'])
.controller('scheduledRidesCtrl', function ($scope, $ionicPopup, $timeout, reverseGeocode, timeUntilDate, findNextRide, accessSchedule) {
  // Testing Services
  // reverseGeocode(34.07636433, -118.4290661);
  // timeUntilDate(new Date(2016, 2, 14, 2, 3, 4, 567), "string");
  // findNextRide(new Date(2016, 0, 1, 2, 3, 4, 567), [false, true, false, true, false, true, false]);
  // accessSchedule();

  $scope.UberTypes = ["UberX", "UberBlack", "UberBlack", "ACCESS"];
  $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $scope.scheduledRides = accessSchedule; // Store in the controller
});
