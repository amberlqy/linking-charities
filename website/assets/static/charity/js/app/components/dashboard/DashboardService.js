
(function () {
    'use strict';

    angular
        .module('charity.dashboard.services')
        .factory('Dashboard', Dashboard);

    Dashboard.$inject = ['$http'];

    function Dashboard($http) {

        return {
        };
    }
})();