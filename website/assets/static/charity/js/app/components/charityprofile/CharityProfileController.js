(function () {
    'use strict';

    angular
        .module('charity.charityprofile.controllers')
        .controller('CharityProfileController', CharityProfileController);


    CharityProfileController.$inject = ['$scope', '$http', '$location', '$anchorScroll', 'CharityProfile', '$routeParams'];

    function CharityProfileController($scope, $http, $location, $anchorScroll, CharityProfile, $routeParams) {
        charityProfile();

        function charityProfile() {
            $http.get('/api/charity/charity_search/', {params: {"id": $routeParams.id}}).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                var charityProfile = data.data["charity_profile"];
                console.log(charityProfile);
                $scope.profile = charityProfile;
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting Charity Profile failed! ' + status);
            }
        }

        <!--financials-->
        var financialdata = new Object();
        var income_voluntary, income_trading, income_investment, income_activities, income_other;
        var spending_voluntary, spending_trading, spending_investment, spending_activities, spending_other;
        $http.get('/static/charity/resources/financials.json').success(
            function (response) {
                $scope.financialsJson = response;
                financialdata = response;
                income_voluntary = financialdata.income_voluntary;
                income_trading = financialdata.income_trading;
                income_investment = financialdata.income_investment;
                income_activities = financialdata.income_activities;
                income_other = financialdata.income_other;

                spending_voluntary = financialdata.spending_voluntary;
                spending_trading = financialdata.spending_trading;
                spending_investment = financialdata.spending_investment;
                spending_activities = financialdata.spending_activities;
                spending_other = financialdata.spending_other;

                $scope.labels = ["Voluntary£", "Trading to raise funds£", "Investment£", "Charitable activities£", "Other£"];
                $scope.incomedata = [Number(income_voluntary), Number(income_trading), Number(income_investment), Number(income_activities), Number(income_other)];
                $scope.spendingdata = [Number(spending_voluntary), Number(spending_trading), Number(spending_investment), Number(spending_activities), Number(spending_other)];
            }
        );


        <!--link to activities-->
        $scope.activityPage = function (name) {
            if (name == 'charitytest') {
                $location.path('/charityprofile/activities/' + charitytest);
            }
        };
        <!--get data about activities details-->
        $http.get('/static/charity/resources/profile.json').success(
            function (response) {
                $scope.activityJson = response;
            }
        );
        <!--get data about document details-->
        $http.get('/static/charity/resources/charityprofiledocument.json').success(
            function (response) {
                $scope.documentJson = response;
            }
        );


    }
})

();