var timeUntilDate = function(a, returnType) {
  console.log("Finding time until", secondDate);
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
  console.log([d, pad(h), pad(m)].join(':')); //Feedback
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
