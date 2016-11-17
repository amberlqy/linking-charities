
(function () {
    'use strict';

    angular
        .module('charity.navbar.controllers')
        .controller('AdvancedSearchController', AdvancedSearchController);

    AdvancedSearchController.$inject = ['$scope', '$modalInstance', 'Search', '$location'];

    function AdvancedSearchController($scope, $modalInstance, Search, $location) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.advancedSearch = function () {
            var searchKey = {name: $scope.name,
                              target: $scope.target,
                              country: $scope.country,
                              city: $scope.city,
                              ranking: $scope.ranking
                            };
            Search.setSearchKey(searchKey);
            $modalInstance.close();
            $location.path('/search/#=' + Math.random().toString(36).substring(7));
        };
    }
})();