
(function () {
    'use strict';

    angular
        .module('charity.preview.services')
        .factory('PreviewProfile', PreviewProfile);

    PreviewProfile.$inject = ['$http'];

    function PreviewProfile($http) {
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