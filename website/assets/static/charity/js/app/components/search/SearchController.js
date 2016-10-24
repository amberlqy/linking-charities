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

                    //pagination
                    $scope.data = response.data.records;
                    $scope.pageSize = 5;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize);
                    $scope.newPages = $scope.pages > 5 ? 5 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
                    };
                    $scope.items = $scope.data.slice(0, $scope.pageSize);
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    $scope.selectPage = function (page) {
                        if (page < 1 || page > $scope.pages) return;
                        if (page > 2) {
                            var newpageList = [];
                            for (var i = (page - 3); i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)); i++) {
                                newpageList.push(i + 1);
                            }
                            $scope.pageList = newpageList;
                        }
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("选择的页：" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    };
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                });
        }

        $scope.showNumber = {
            name: "Current Selected Number",
            currentNumber: "10"
        };

        $scope.activities =
            [
                "10",
                "25",
                "50",
                "100"
            ];

// function for direct to profile page
        $scope.profilePage = function (id) {
            if (id == 'CharityOne') {
                $location.path('/charityprofile/' + id);
            }
        };
    }
})
();