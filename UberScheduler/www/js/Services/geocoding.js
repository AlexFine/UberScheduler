// console.log("Geocoding service file loaded")
angular.module('geocoding', ['ionic', 'ngCordova'])
  .factory('reverseGeocode', function() {
    return function(lat, lng) {
      var locationStr = "[" + lat + ", " + lng +"]:";
      var geocoder = new google.maps.Geocoder;
      var latlng = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
      // console.log(locationStr, "Geocode lookup started");
      geocoder.geocode({
        'location': latlng
      }, function (results, status) {
        // console.log("Lookup finished")
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            var address = results[1].formatted_address;
            console.log(locationStr, address)
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
  })
