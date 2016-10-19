
(function () {
    'use strict';

    angular
        .module('charity.home.services')
        .factory('Home', Home);

    Home.$inject = ['$http'];

    function Home($http) {
        return {}
    }
})();