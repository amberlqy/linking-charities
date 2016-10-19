'use strict';

/**
 * @ngdoc overview
 * @name linkingCharitiesWorldwideAppApp
 * @description
 * # linkingCharitiesWorldwideAppApp
 *
 * Main module of the application.
 */

var app = angular
  .module('linkingCharitiesWorldwideAppApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngStorage'
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/static/charity/views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        resolve:{
          "check": function($location, $rootScope){
            if(!$rootScope.isLogin){
              //$location.path('/');
            }
          }
        },
        templateUrl: '/static/charity/views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/testInfo', {
        templateUrl: '/static/charity/views/testInfo.html',
        controller: 'TestInfoCtrl',
        controllerAs: 'testInfo'
      })
      .when('/about', {
        templateUrl: '/static/charity/views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
  }])

  .run(['$rootScope', '$location', '$cookieStore', '$http', '$localStorage',
    function ($rootScope, $location, $cookieStore, $http, $localStorage) {

        // Set the required headers
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

      // keep user logged in after page refresh
      $rootScope.globals = $cookieStore.get('globals') || {};
      //var object = {value: "value", timestamp: new Date().getTime()}
      //$localStorage.latestTime = object.timestamp;
      //alert($localStorage.latestTime);

      //compate time method here
      //compareTime(dateString, now);

      // Optional
      //config.headers = config.headers || {};
      if ($localStorage.token) {
        //config.headers.Authorization = 'Bearer ' + $localStorage.token;
      }

      if ($rootScope.globals.currentUser) {
        //$http.defaults.headers.common.Authorization
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/about' && !$rootScope.globals.currentUser) {
          //$location.path('/');
        }
      });
    }]);
