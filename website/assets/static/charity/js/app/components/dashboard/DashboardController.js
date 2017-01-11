
(function () {
    'use strict';

    angular
        .module('charity.dashboard.controllers')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', 'Authentication', 'Snackbar', 'Dashboard'];

    function DashboardController($scope, Authentication, Snackbar, Dashboard) {

        var vm = this;

        activate();

        function activate() {

            // Tab management
            vm.tab = 1;
            vm.selectTab = function (setTab){
                vm.tab = setTab;
            };
            vm.isSelected = function(checkTab) {
                return this.tab === checkTab;
            };
        }
    }
})();