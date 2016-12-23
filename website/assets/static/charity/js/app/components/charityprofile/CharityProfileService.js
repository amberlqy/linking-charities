
(function () {
    'use strict';

    angular
        .module('charity.charityprofile.services')
        .factory('CharityProfile', CharityProfile);

    CharityProfile.$inject = ['$http'];

    function CharityProfile($http) {
        return {}
    }
})();