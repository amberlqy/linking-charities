
(function () {
    'use strict';

    angular
        .module('charity.charityprofile.services')
        .factory('CharityProfile', CharityProfile);

    CharityProfile.$inject = ['$http'];

    function CharityProfile($http) {
        var _charityId = "";
        return {
            getCharityId: function () {
                return _charityId;
            },
            setCharityId: function(value) {
                _charityId = value;
            }
        };
    }
})();