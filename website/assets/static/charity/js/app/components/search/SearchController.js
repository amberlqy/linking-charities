(function () {
    'use strict';

    angular
        .module('charity.search.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$http', 'Search', '$location'];

    function SearchController($scope, $http, Search, $location) {

        $scope.searchKeyWord = Search.getSearchKey();
        search();

        function search(row) {
            $http.get('/static/charity/resources/dataExample.json').success(
                function (response) {
                    $scope.searchResults = response;
                    $scope.searchResults.splice($scope.myData.indexOf(row), 1);
                });
        }

        //Pagination Function
        $scope.currentPage = 0;
        $scope.pageSize = 10;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.filtered.length / $scope.pageSize);
        };
        $scope.selectPage = function(page){
            if(page>= $scope.numberOfPages()) {
                $scope.currentPage = $scope.numberOfPages()-1;
            }
            else if(page<0) {
                $scope.currentPage = 0;
            }
            else {
                $scope.currentPage = page;
            }
        };
        $scope.selectPageInput = function(){
            if(document.getElementById("inputPage").value >= 1 && document.getElementById("inputPage").value <= $scope.numberOfPages()){
                $scope.currentPage = document.getElementById("inputPage").value - 1;
            }
            else{
                alert("please input correct pages");
                $scope.currentPage=0;
            }
        }

        //numbers of listed charities
        $scope.firstInfo = function () {
            if ($scope.filtered.length != 0) {
                return ($scope.currentPage * $scope.pageSize + 1);
            }
            else {
                return 0;
            }
        };
        $scope.secondInfo = function () {
            if ($scope.filtered.length == 0) {
                return 0;
            }
            else if ((($scope.currentPage + 1) * $scope.pageSize) > $scope.filtered.length) {
                return ($scope.filtered.length);
            }
            else {
                return (($scope.currentPage + 1) * $scope.pageSize);
            }
        };

        // //Select entries
        // $scope.showNumber = {
        //     name: "Current Selected Number",
        //     currentNumber: "10"
        // };
        //
        $scope.entries = ["10", "25", "50", "100"];

        //Sort Function
        $scope.sortClick = function (sortKeyName) {
            $scope.sortKey = sortKeyName;
            $scope.reverse = !$scope.reverse;
        };

        //$scope.sortConditions = ["Default", "Name:A-Z", "Name:Z-A"];


        //function for direct to profile page
        $scope.profilePage = function (id) {
            if (id == 'CharityOne') {
                $location.path('/charityprofile/' + id);
            }
        };
    }
})
();