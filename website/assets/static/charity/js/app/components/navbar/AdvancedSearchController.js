
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
            var searchKey = {charityname: $scope.name,
                              charitytarget: $scope.target,
                              charitylocation: $scope.location,
                              charityranking: $scope.ranking
                            };
            Search.setSearchKey(searchKey);
            $modalInstance.close();
            $location.path('/search/#=' + $scope.name);
        };
    }
})();