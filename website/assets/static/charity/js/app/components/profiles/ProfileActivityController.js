
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityController', ProfileActivityController);

    ProfileActivityController.$inject = ['$http', '$location', 'Profile', '$routeParams', 'activityPrepService', '$filter'];

    function ProfileActivityController($http, $location, Profile, $routeParams, activityPrepService, $filter) {
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

                for (var i = 0; i < charityActivity.length; i++) {
                    // String to date format
                    var date = charityActivity[i].date;
                    if (date != undefined && date != null){
                        var strDate = date.toString();
                        charityActivity[i].date = new Date(strDate.replace(pattern, '$1-$2-$3'));
                    }
                    // list of images of each activity
                    var imgLength = charityActivity[i].images.length;
                    var image1, image2, image3;
                    if (imgLength == 0) {
                        image1 = image2 = image3 = null;
                    } else if (imgLength == 1) {
                        image1 = image2 = image3 = charityActivity[i].images[0].image;
                    } else if (imgLength == 2) {
                        image1 = image3 = charityActivity[i].images[0].image;
                        image2 = charityActivity[i].images[1].image;
                    } else {
                        image1 = charityActivity[i].images[imgLength - 3].image;
                        image2 = charityActivity[i].images[imgLength - 2].image;
                        image3 = charityActivity[i].images[imgLength - 1].image;
                    }

                    charityActivity[i].images = null;
                    charityActivity[i].image1 = image1;
                    charityActivity[i].image2 = image2;
                    charityActivity[i].image3 = image3;
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
    }
})();