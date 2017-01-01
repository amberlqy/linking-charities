
(function () {
    'use strict';

    angular
        .module('charity.navbar.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', 'Authentication', '$location', 'Search'];

    function NavbarController($scope, $http, Authentication, $location, Search) {
        var vm = this;
        vm.search = {};
        var userDetails = Authentication.getAuthenticatedAccount();
        if (userDetails != undefined){
            vm.user = userDetails.username;
            vm.userRole = userDetails.userRole;
        }
        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.logout = logout;
        vm.isActive = isActive;

        vm.search.suggestion = [];

        function logout() {
            Authentication.logout();
        }

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        vm.searchClick = function() {
            if (vm.search.searchKey == undefined){
                vm.search.searchKey = "";
            }
            var searchKey = { name: vm.search.searchKey,
                              filter: null,
                              country: null,
                              city: null,
                              tag: null
                            };
            $location.path('/search/key').search(searchKey);
        };

        vm.advanceSearchClick = function() {
            var searchKey = { name: vm.search.charityname,
                              filter: vm.search.filter,
                              country: vm.search.country,
                              city: vm.search.city,
                              tag: angular.element('#tagsinput').val()
                            };
            $location.path('/search/key').search(searchKey);
        };

        $scope.inputSelected = function (selected) {
            vm.search.searchKey = selected;
            if (selected != "" && selected != null && selected != undefined) {
                updateSuggestion(selected);
            }
        };

        $scope.afterSelected = function (selected) {
            if (selected != undefined) {
                vm.search.searchKey = selected.title;
            }
        };

        function updateSuggestion(selected){
            var searchKey = {"name": selected};
            Search.search(searchKey).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                var search = data.data["charity_profiles"];
                vm.search.suggestion = search;
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting Search failed! ' + status);
            }
        }
    }
})();