
(function () {
    'use strict';

    angular
        .module('charity.search.services')
        .factory('Search', Search);

    Search.$inject = ['$http'];

    function Search($http) {
        var _searchKey = "";
        return {
            getSearchKey: function () {
                return _searchKey;
            },
            setSearchKey: function(value) {
                _searchKey = value;
            }
        };
    }
})();