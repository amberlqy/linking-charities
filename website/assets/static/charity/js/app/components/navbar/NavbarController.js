
(function () {
    'use strict';

    angular
        .module('charity.navbar.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', 'Authentication', '$location', 'Search'];

    function NavbarController($scope, $http, Authentication, $location, Search) {
        var vm = this;
        var userDetails = Authentication.getAuthenticatedAccount();
        if (userDetails != undefined){
            vm.user = userDetails.username;
            vm.userRole = userDetails.userRole;
        }
        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.logout = logout;
        vm.isActive = isActive;

        $scope.Charities = [];

        function logout() {
            Authentication.logout();
        }

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        function updateSuggestion(selected){
            $http.get('/api/charity/charity_search/', {params:{"all": true}}).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                var search = data.data["charity_profiles"];
                $scope.Charities = search;
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting Search failed! ' + status);
            }
        }

        $scope.searchClick = function() {
            Search.setSearchKey($scope.searchKeyWord);
            $location.path('/search/#=' + $scope.searchKeyWord);
        };

        $scope.inputSelected = function (selected) {
            $scope.searchKeyWord = selected;
            updateSuggestion(selected);
        };
    }
})();