'use strict';

angular.module('linkingCharitiesWorldwideAppApp')
    .controller('CharityModalInstanceCtrl', ['$scope', '$modalInstance', '$http', // 'action', 'Charity',
        //function ($scope, $modalInstance, action, Charity) {
         function ($scope, $modalInstance, $http) {
           $scope.save = function () {
             loading();

             saveCharity();

             function saveCharity() {
               // use $.param jQuery function to serialize data from JSON
               var data = $.param({
                 fName: $scope.firstName,
                 lName: $scope.lastName
               });

               var dataObj = {
                 name : $scope.name,
                 employees : $scope.employees,
                 headoffice : $scope.headoffice
               };

               var res = $http.post('URL Here', dataObj);
               res.success(function(data, status, headers, config) {
                 $scope.message = data;
               });
               res.error(function(data, status, headers, config) {
                 alert( "failure message: " + JSON.stringify({data: data}));
               });

               $modalInstance.close();

               /*
               var config = {
                 headers : {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                 }
               }

              // 3 parameters for content-type
               $http.post('/ServerRequest/PostDataResponse', data, config)
                 .success(function (data, status, headers, config) {
                   alert('aaaa');
                   $scope.PostDataResponse = data;
                 })
                 .error(function (data, status, header, config) {
                   alert('bbb');
                   $scope.ResponseDetails = "Data: " + data +
                     "<hr />status: " + status +
                     "<hr />headers: " + header +
                     "<hr />config: " + config;
                 });*/
             };

             //Charity.save($scope.item).then(function () {
               //$modalInstance.close();
             //});
           };

           $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
           };
            /*
            $scope.action = action;

            $scope.remove = function () {
                loading();
                Charity.remove($scope.item).then(function () {
                    $modalInstance.close();
                });
            };
            */

           function loading() {
             document.getElementById('sprint-button-save').disabled = true;
             document.getElementById('sprint-button-cancel').disabled = true;
             document.getElementById('sprint-button-remove').disabled = true;
             document.getElementById('loading-icon').style.visibility = 'visible';
           }
        }
    ]);
