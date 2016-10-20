
(function () {
    'use strict';

    angular
        .module('charity.navbar.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication', '$location', 'Search'];

    function NavbarController($scope, Authentication, $location, Search) {
        var vm = this;

        vm.user = Authentication.getAuthenticatedAccount();
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
            $location.path('/search');
        };
    }
})();