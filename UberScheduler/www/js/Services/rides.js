// console.log("Rides service file loaded")
angular.module('myServiceModule', ['ionic', 'ngCordova'])
  .factory('accessSchedule', function() {
    var testVariable = "Kevin"
    return testVariable;
  })
