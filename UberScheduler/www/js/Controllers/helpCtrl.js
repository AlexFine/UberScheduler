angular.module('helpCtrl', ['ui.bootstrap'])
.controller('helpCtrl', function ($scope, $stateParams) {
  $scope.today = function () {
    $scope.dt = new Date();
    var ROOT = 'https://uberscheduler-1203.appspot.com/_ah/api';
    gapi.client.load('uberApi', 'v1', function() {
      console.log("success")
    }, ROOT);
  };
  $scope.today();

  $scope.clear = function () {
    gapi.client.uberApi.ride.return({
      "key": 5066549580791808
    }).execute(function(resp) {
      console.log(resp);
    });
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
