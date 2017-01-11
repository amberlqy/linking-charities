angular
    .module('linkingCharitiesWorldwideAppApp', []);

(function () {
    'use strict';

    angular
        .module('linkingCharitiesWorldwideAppApp', [
            'routes',
            'config',
            'chart.js',
            'charity.authentication',
            'charity.navbar',
            'charity.home',
            'charity.snackbar',
            'charity.profiles',
            'charity.search',
            'charity.payment',
            'charity.user'
        ]);

    angular
        .module('routes', ['ngRoute']);

    angular
        .module('config', []);

    angular
        .module('linkingCharitiesWorldwideAppApp')
        .factory('httpRequestInterceptor', httpRequestInterceptor)
        .config(function($httpProvider, $mdThemingProvider) {
            $httpProvider.interceptors.push('httpRequestInterceptor');

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('blue');
        })
        .run(run);

    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

    function httpRequestInterceptor($cookies) {
        return {
            request: function (config) {

                var token = $cookies.get('token');
                if (typeof token !== "undefined"){
                    config.headers['Authorization'] = 'JWT ' + token;
                }

                return config;
            },

            requestError: function(config) {
                return config;
            },

            response: function(res) {
                return res;
            },

            responseError: function(res) {
                return res;
            }
        }
    }
})();