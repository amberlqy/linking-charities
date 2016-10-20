
(function () {
    'use strict';

    angular
        .module('charity.search.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$http', 'Search', '$location'];

    function SearchController($scope, $http, Search, $location) {
        $scope.searchKeyWord = Search.getSearchKey();
        search();

        function search(row) {
            $http.get('/static/charity/resources/dataExample.json').success(
                function (response) {
                    $scope.searchResults = response;
                    $scope.searchResults.splice($scope.myData.indexOf(row),1);
                }
            );
        }

        // function for direct to profile page
        $scope.profilePage = function(id) {
            if (id == 'CharityOne'){
                $location.path('/charityprofile/' + id);
            }
        };
    }
})();