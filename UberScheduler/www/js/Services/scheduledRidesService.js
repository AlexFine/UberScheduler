console.log("Scheduled Rides service file loaded")
angular.module('scheduledRidesService', ['ionic', 'ngCordova', 'ridesService'])
  .factory('accessSchedule', function(findNextRide) {
    // ********* Pull from server here *********
    var schedule = [
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
        product: 1
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
        nextRide: new Date(findNextRide(new Date(2016, 0, 1, 18, 32, 5, 567), [false, true, false, true, false, true, false])),
        product: 2
      }
    ];
    return schedule;
  });
