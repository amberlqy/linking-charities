
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityController', ProfileActivityController);

    ProfileActivityController.$inject = ['$http', '$location', 'Payment', 'Profile', '$routeParams', 'activityPrepService', '$filter'];

    function ProfileActivityController($http, $location, Payment, Profile, $routeParams, activityPrepService, $filter) {
        var vm = this;
        vm.isCharity = true;
        vm.activity = {};

        var pattern = /(\d{4})(\d{2})(\d{2})/; // date pattern

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get activity data
            setActivity();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.name;
            }

            function setActivity() {
                var charityActivity = activityPrepService.data.charity_activities;
                if (charityActivity == undefined || charityActivity == null) {
                    alert("Page Not Found. We could not find the page you requested.");
                    $location.url('/home');
                    return;
                }
                // String to date format
                for (var i = 0; i < charityActivity.length; i++) {
                    var date = charityActivity[i].date;
                    if (date != undefined && date != null){
                        var strDate = date.toString();
                        charityActivity[i].date = new Date(strDate.replace(pattern, '$1-$2-$3'));
                    }
                }
                vm.activity = charityActivity;

                vm.name = $routeParams.name; // name of charity
            }
        }

        // Update activity (
        vm.update = function(activity){
            var date = $filter('date')(activity.date, "yyyyMMdd");
            var activityObj = {
                "id": activity.id,
                "name": activity.name,
                "description": activity.description,
                "date": date
            };
            console.log(activityObj);

            $http({
                method: 'POST',
                url: "/api/charity/activity/",
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("model", angular.toJson(data.model));
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                    return formData;
                },
                data: { model: activityObj, files: [] }
            });
        }

        // TODO : Set donateKey and send to payment controller
        vm.donate = function(){
            var donateKey = {name: vm.name,
                              paypal_email: null,
                              paypal_token: null // etc.
                            };
            var donateInfo = Payment.donateInfo();
            donateInfo.setDonateInfo(donateKey);
            $location.path('/payment');
        }
    }
})();