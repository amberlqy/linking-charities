(function () {
    'use strict';

    angular
        .module('charity.user.controllers')
        .controller('UserController', UserController);

    UserController.$inject = [];


    function UserController() {
        var vm = this;
        vm.user = {};
        vm.user.description = "Implement later in the future/ next phase";
    }
})
();
