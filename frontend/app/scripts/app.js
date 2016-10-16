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
    'kinvey',
    'controllers'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/testInfo', {
        templateUrl: 'views/testInfo.html',
        controller: 'TestInfoCtrl',
        controllerAs: 'testInfo'
      })
      .
      when('/templates/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .
      when('/templates/password_reset', {
        templateUrl: 'views/password_reset.html',
        controller: 'ResetPasswordController'
      })
      .
      when('/templates/sign_up', {
        templateUrl: 'views/sign_up.html',
        controller: 'SignUpController'
      })
      .
      when('/templates/logged_in', {
        templateUrl: 'views/logged_in.html',
        controller: 'LoggedInController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
