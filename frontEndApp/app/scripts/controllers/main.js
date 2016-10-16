'use strict';

/**
 * @ngdoc function
 * @name linkingCharitiesWorldwideAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the linkingCharitiesWorldwideAppApp
 */
angular.module('linkingCharitiesWorldwideAppApp')
  .controller('MainCtrl', function ($scope, $modal) {
    $scope.firstCharity = 'firstCharity';

    $scope.addCharity = function () {
      showCharityModalView({});
    };

    function showCharityModalView(charity) {
      var modalInstance = $modal.open({
        templateUrl: 'views/charity-edit-modal.html',
        controller: 'CharityModalInstanceCtrl',
        scope: $scope,
        resolve: {} // empty storage
        /*
         resolve: {
         action: function () {
         if (charity.id === undefined) {
         return 'Create';
         } else {
         return 'Edit';
         }
         },
         item: function () {
         return charity;
         }
         }*/
      });

      modalInstance.result.then(function () {
        //fetchProject();
      });
    }
  });
