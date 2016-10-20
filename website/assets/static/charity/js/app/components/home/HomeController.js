
(function () {
    'use strict';

    angular
        .module('charity.home.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$location', 'Authentication', 'Snackbar', 'Home'];

    function IndexController($location, Authentication, Snackbar, Home) {
        var vm = this;

        activate();

        function activate() {

            vm.isAuthenticated = Authentication.isAuthenticated();
            var authenticatedAccount = Authentication.getAuthenticatedAccount();

            // Redirect if not logged in
            if (!authenticatedAccount) {
                $location.url('/login');
                //Snackbar.error('You are not authorized to view this page.');
            }
        }
    }
})();