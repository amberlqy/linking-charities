(function () {
    'use strict';

    angular
        .module('charity.search.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', '$http', 'Search', '$location', '$anchorScroll'];

    function SearchController($scope, $http, Search, $location, $anchorScroll) {

        //search function
        $scope.searchKeyWord = Search.getSearchKey();
        search();
        function search(row) {
            $http.get('/static/charity/resources/dataExample10000.json').success(
                function (response) {
                    $scope.searchResults = response;
                    $scope.searchResults.splice($scope.myData.indexOf(row), 1);
                });
        }

        //Pagination Function
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.filtered.length / $scope.pageSize);
        };
        $scope.selectPage = function(page){
            if(page>0 && page<=$scope.numberOfPages()){
                $scope.currentPage = page;
                document.getElementById("inputPage").value = $scope.currentPage;
                $anchorScroll();
            }
        };
        $scope.selectPageInput = function(){
            if(document.getElementById("inputPage").value >= 1 && document.getElementById("inputPage").value <= $scope.numberOfPages()){
                $scope.currentPage = parseInt(document.getElementById("inputPage").value);
                $anchorScroll();
            }
            else{
                alert("please input correct pages");
            }
        };

        //info about numbers of listed charities
        $scope.firstInfo = function () {
            if ($scope.filtered.length != 0) {
                return (($scope.currentPage-1) * $scope.pageSize + 1);
            }
            else {
                return 0;
            }
        };
        $scope.secondInfo = function () {
            if ($scope.filtered.length == 0) {
                return 0;
            }
            else if (($scope.currentPage * $scope.pageSize) > $scope.filtered.length) {
                return ($scope.filtered.length);
            }
            else {
                return ($scope.currentPage * $scope.pageSize);
            }
        };

        //Select charities
        $scope.charities = ["10", "25", "50", "100"];
        $('#selectCharities').change(function () {
            $scope.selectPage(1);
        });


        //Sort Function
        //$scope.sortConditions = ["Default", "Name:A-Z", "Name:Z-A"];
        $scope.sortClick = function (sortKeyName) {
            $scope.sortKey = sortKeyName;
            $scope.reverse = !$scope.reverse;
            $scope.selectPage(1);
        };

        //function for direct to profile page
        $scope.profilePage = function (id) {
            if (id == 'CharityOne') {
                $location.path('/charityprofile/' + id);
            }
        };
    }
})
();