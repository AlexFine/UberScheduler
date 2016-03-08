// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
  'starter.controllers',
  'ridesCtrl',
  'editRideCtrl',
  'homeScreenCtrl',
  'scheduledRidesCtrl',
  'rideHistoryCtrl',
  'settingsCtrl',
  'helpCtrl',
  'ModalInstanceCtrl'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/navbar.html',
    controller: 'AppCtrl'
  })

  .state('app.homeScreen', {
    url: '/homeScreen',
    views: {
      'home-screen-tab': {
        templateUrl: 'templates/homeScreen.html',
        controller: 'homeScreenCtrl'
      }
    }
  })

  .state('app.scheduledRides', {
    url: '/scheduledRides',
    views: {
      'scheduled-rides-tab': {
        templateUrl: 'templates/scheduledRides.html',
        controller: 'scheduledRidesCtrl'
      }
    }
  })

  .state('app.editRide', {
    url: '/rideEdit/:rideId',
    views: {
      'edit-ride-tab': {
        templateUrl: 'templates/edit-ride.html',
        controller: 'editRideCtrl'
      }
    }
  })

  .state('app.rideHistory', {
    url: '/rideHistory',
    views: {
      'ride-history-tab': {
        templateUrl: 'templates/ride-history.html',
        controller: 'rideHistoryCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'settings-tab': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('app.help', {
    url: '/help',
    views: {
      'help-tab': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/homeScreen');
});
