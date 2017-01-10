
(function () {
    'use strict';

    angular
        .module('charity.payment.controllers')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$http', '$location', 'Payment', '$routeParams', '$filter', 'paymentPrepService', '$cookies'];

    function PaymentController($http, $location, Payment, $routeParams, $filter, paymentPrepService, $cookies) {
        var vm = this;
        vm.donate = {};
        vm.volunteer = {};
        vm.activities = {};
        vm.donate.disabled = true;
        vm.volunteer.disable = false;
        vm.donate.success = false;

        activate();

        function activate() {
            if ($routeParams.charityName != undefined) { // Initial payment form
                var charity = paymentPrepService.data.charity_profile;
                if (charity == undefined || charity == null || charity.charity_name == "") {
                    alert("There is no charity that you want to donate");
                    $location.url('/home');
                    return;
                }

                vm.donate.charityName = $routeParams.charityName;
                vm.donate.activity = "";

                // TODO: It's temporary URL because we need only one URL that return
                // all activities of the charity, the charity paypal email and token
                // Get all activities of the charity
                $http.get('/api/charity/get_activity/', {params: {"name": vm.donate.charityName}}).then(activitySuccessFn, activityErrorFn);

                // Set donate info
                vm.donate.paypal_email = charity.paypal_email;
                // vm.donate.paypal_email = "wuzifan0817-facilitator@gmail.com";
                vm.donate.paypal_token = charity.paypal_identity_token;
                vm.donate.currency = {
                    choices: ["GBP", "USD", "JPY"],
                    selected: "GBP"
                };
            } else if ($routeParams.charity_username != undefined) { // Payment confirmation
                vm.verified = "Waiting...";
                var queryParameters = $location.search();
                if (typeof queryParameters.tx !== "undefined"){
                    Payment.getPaymentVerification(queryParameters.tx, $routeParams.charity_username).then(verificationSuccessFn, verificationErrorFn);
                }
            }

            function verificationSuccessFn(data, status, headers, config) {
                if (!$cookies.get('donateInfo')) {
                    alert('This page is expired');
                    $location.url('/home');
                    return null;
                }

                vm.verified = "";
                vm.donate.success = true;

                // Get donateInfo
                var donateInfoTest = $cookies.getObject('donateInfo');

                vm.charityName = donateInfoTest.charityName;
                var time = Date().toLocaleString();

                // Delete cookie
                delete $cookies.remove('donateInfo');

                vm.share = function() {
                    FB.ui(
                        {
                            method: 'feed',
                            name: donateInfoTest.charityName,
                            description: 'You have donated ' + donateInfoTest.donateAmount + " " + donateInfoTest.donateCurrency +
                                         ' to ' + donateInfoTest.charityName,
                            link: 'http://ec2-54-194-73-253.eu-west-1.compute.amazonaws.com:8000/charity/profile/' + donateInfoTest.charityName,
                            picture: 'https://s23.postimg.org/mj3shxr97/Charity_Icon.jpg',
                            caption: time
                        });
                }
            }

            function verificationErrorFn(data, status, headers, config) {
                console.error('Payment confirmation failed! ' + status);
                vm.verified = "Bad payment!";
            }

            function activitySuccessFn(data, status, headers, config) {
                vm.activities = data.data.charity_activities;
            }

            function activityErrorFn(data, status, headers, config) {
                console.error('Activity failed! ' + status);
            }
        }

        vm.amountChange = function() {
            if (vm.donate.amount > 0) {
                vm.donate.disabled = false;
            } else {
                vm.donate.disabled = true;
            }
        }

        vm.donateClick = function(){
            // Save data info
            var donateInfo = {"charityName": vm.donate.charityName,
                              "charityActivity": vm.donate.activity,
                              "donateAmount": vm.donate.amount,
                              "donateCurrency": vm.donate.currency.selected
                             };


            var expiry = new Date();
            var minutes = 10;
            expiry.setTime(expiry.getTime() + (minutes * 60 * 1000));
            // Save donateInfo in cookie
            $cookies.putObject('donateInfo', donateInfo,{
              expires: expiry
            });
        }

        // Save volunteer
        vm.volunteerRegister = function() {
            vm.volunteer.disable = true;
            var date = $filter('date')(vm.volunteer.date, "yyyyMMdd");
            var volunteer = {"volunteerName": vm.volunteer.name,
                             "volunteerSurname": vm.volunteer.surname,
                             "volunteerEmail": vm.volunteer.email,
                             "volunteerPhone": vm.volunteer.phone,
                             "charityName": vm.donate.charityName,
                             "charityActivity": vm.volunteer.activity,
                             "volunteerDate": date
                            };
            Payment.volunteer(volunteer).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                vm.volunteer.disable = false;
                var statusCode = data.status;
                // Error occurs
                if (statusCode.toString().charAt(0) != "2") {
                    alert('Error occurs, please try again');
                } else {
                    alert("Thank you for your volunteer");
                    $location.url('/profile/' + vm.donate.charityName);
                }
            }

            function getErrorFn(data, status, headers, config) {
                vm.volunteer.disable = false;
                alert('Error occurs, please try again');
            };
        }
    }
})();