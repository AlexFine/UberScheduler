// console.log("Rides service file loaded")
angular.module('ridesService', ['ionic', 'ngCordova'])
  .factory('accessSchedule', function() {
    var testVariable = "Kevin"
    return testVariable;
  })

  .factory('findNextRide', function() {
    return function(rideTime, daysOfWeek) { //Now using node package: 'later'
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

      //It always sets the hours 8 hours too few after compiling the schedule because of the timezone - currently only supports our time zone
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
  })
