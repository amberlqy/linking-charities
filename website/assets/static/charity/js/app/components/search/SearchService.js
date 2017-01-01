
(function () {
    'use strict';

    angular
        .module('charity.search.services')
        .factory('Search', Search);

    Search.$inject = ['$http'];

    function Search($http) {
        return {
            search: getSearch,
            advanceSearch: getAdvanceSearch
        };

        // Return search by name
        function getSearch(searchKey) {
            return $http.get('/api/charity/charity_search/', {
                params: {"name": searchKey.name}
            });
        }

        // Return advance search
        function getAdvanceSearch(searchKey) {
            return $http.get('/api/charity/charity_advanced_search/', {
                    params: {
                        "name": searchKey.name,
                        "filter": searchKey.filter,
                        "country": searchKey.country,
                        "city": searchKey.city,
                        "tags": searchKey.tag
                    }});
        }
    }
})();