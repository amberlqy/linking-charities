
(function () {
    'use strict';

    angular
        .module('charity.navbar.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication', '$location', 'Search'];

    function NavbarController($scope, Authentication, $location, Search) {
        var vm = this;
        var userDetails = Authentication.getAuthenticatedAccount();
        if (userDetails != undefined){
            vm.user = userDetails.username;
            vm.userRole = userDetails.userRole;
        }
        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.logout = logout;
        vm.isActive = isActive;

        function logout() {
            Authentication.logout();
        }

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        $scope.searchClick = function() {
            Search.setSearchKey($scope.searchKeyWord);
            $location.path('/search/#=' + $scope.searchKeyWord);
        };
    }
})();