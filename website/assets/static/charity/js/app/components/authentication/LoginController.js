
(function () {
    'use strict';

    angular
        .module('charity.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'Authentication'];

    function LoginController($location, Authentication) {
        var vm = this;
        vm.login = login;

        activate();

        function activate() {

            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $location.url('/home');
            }
        }

        function login() {
            Authentication.login(vm.username, vm.password);
        }
    }
})();