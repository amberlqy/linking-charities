
(function () {
    'use strict';

    angular
        .module('charity.charityprofile.services')
        .factory('CharityProfile', CharityProfile);

    CharityProfile.$inject = ['$http'];

    function CharityProfile($http) {
        /*
        var _searchKey = "";
        return {
            getSearchKey: function () {
                return _searchKey;
            },
            setSearchKey: function(value) {
                _searchKey = value;
            }
        };*/
    }
})();