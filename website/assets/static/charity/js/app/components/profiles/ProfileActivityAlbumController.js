
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityAlbumController', ProfileActivityAlbumController);

    ProfileActivityAlbumController.$inject = ['$http', '$location', 'Payment', 'Profile', '$routeParams', '$scope'];

    function ProfileActivityAlbumController($http, $location, Payment, Profile, $routeParams, $scope) {
        var vm = this;
        vm.album = {};

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get activity data
            setAlbum();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.name;
            }

            function setAlbum() {
                // var charityActivity = activityPrepService.data.charity_activities;
                // if (charityActivity == undefined || charityActivity == null) {
                //     alert("Page Not Found. We could not find the page you requested.");
                //     $location.url('/home');
                //     return;
                // }
                // vm.activity = charityActivity;

                vm.name = $routeParams.name; // name of charity
                vm.id = $routeParams.id; // id of activity
            }
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


        $scope.posts = [{id:1,title:"title1",content:"content1",caption:"caption1"},{id:2,title:"title2",content:"content2",caption:"caption2"}];
        $scope.share = function(post){
            FB.ui(
                {
                    method: 'feed',
                    name: 'Test Name',//'This is the content of the "name" field.',
                    link: 'http://ec2-54-194-73-253.eu-west-1.compute.amazonaws.com:8000/charity/',
                    picture: 'http://www.hyperarts.com/external-xfbml/share-image.gif',
                    caption: post.caption,
                    description: 'Test Desciption',//'This is the content of the "description" field, below the caption.',
                    message: 'Test Message'
                    // method: 'share',
                    // href: 'http://ec2-54-194-73-253.eu-west-1.compute.amazonaws.com:8000/charity/',     // The same than link in feed method
                    // title: 'Test Title',  // The same than name in feed method
                    // //picture: 'path_to_your_picture',
                    // caption: 'My caption',
                    // description: 'My Description'
                });
        }
    }
})();