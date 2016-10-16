'use strict';

angular.module('linkingCharitiesWorldwideAppApp')
    .controller('CharityModalInstanceCtrl', ['$scope', '$modalInstance', // 'action', 'Charity',
        //function ($scope, $modalInstance, action, Charity) {
         function ($scope, $modalInstance) {
           $scope.save = function () {
             loading();
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
